import { AtomDisposableList } from "@web-atoms/core/dist/core/AtomDisposableList";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import XNode, { IElementAttributes, xnodeSymbol } from "@web-atoms/core/dist/core/XNode";
import { AtomControl, ElementValueSetters } from "@web-atoms/core/dist/web/controls/AtomControl";
import "./AtomPopover.css";
import { relativeRect } from "./relativeRect";
import getContainingBlock from "./getContainingBlock";

ElementValueSetters["anchor-left"] = (c, e, v) => e.setAttribute("anchor-left", v);
ElementValueSetters["anchor-right"] = (c, e, v) => e.setAttribute("anchor-right", v);
ElementValueSetters["anchor-top"] = (c, e, v) => e.setAttribute("anchor-top", v);
ElementValueSetters["anchor-bottom"] = (c, e, v) => e.setAttribute("anchor-bottom", v);

export interface IAnchorPopover extends IElementAttributes {
    "anchor-left"?: "parent-left" | "parent-right",
    "anchor-right"?: "parent-left" | "parent-right",
    "anchor-top"?: "parent-top" | "parent-bottom",
    "anchor-bottom"?: "parent-top" | "parent-bottom"
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "atom-pop-over": IAnchorPopover;
        }
    }
}

class AtomPopoverElement extends HTMLElement {


    timer: any;

    lastParent: HTMLElement;

    result: any;
    aborted = "cancel";

    root: ShadowRoot;
    slotElement: HTMLSlotElement;

    connectedCallback() {

        // set defaults...

        if(!this.root) {

            const root = this.root = this.attachShadow({ mode: "open" });
            // const container = document.createElement("div");
            // container.setAttribute("part", "root");
            const slot = document.createElement("slot");
            slot.setAttribute("part", "container");
            this.slotElement = slot;
            root.appendChild(slot);
            // container.appendChild(slot);
            // root.appendChild(container);
        }
        setTimeout(() => this.updatePosition(), 100);

        window.addEventListener("scroll", this.updatePosition, { passive : true, capture: true });

        setTimeout(() => {
            document.body.addEventListener("click", this.closePopover);
        }, 100);
    }

    disconnectedCallback() {

        if(this.lastParent?.isConnected) {
            this.dispatchEvent(new CustomEvent("removed", {
                detail: { result: this.result, aborted: this.aborted },
                bubbles: true
            }));
        }

        document.body.removeEventListener("click", this.closePopover);
        window.removeEventListener("scroll", this.updatePosition);
        clearInterval(this.timer);
    }

    closePopover = (e: Event) => {

        const cancelOnBlur = /^(true|yes|1)$/i.test(this.getAttribute("cancel-on-blur") || "true");
        if (!cancelOnBlur) {
            return;
        }
        setTimeout(() => {
            // this is to let other event handlers handle clicks
            let target = e.target as HTMLElement;
            while(target) {
                if (target.hasAttribute("data-close-on-click")) {
                    break;
                }
                if(target === this.parentElement) {
                    return;
                }
                target = target.parentElement;
            }
            // click was outside
            this.lastParent = null;
            const ce = new CustomEvent("removing", {
                detail: { result: this.result, aborted: this.aborted },
                bubbles: true,
                cancelable: true
            });
            this.dispatchEvent(ce);
            if (ce.defaultPrevented) {
                return;
            }
            this.dispatchEvent(new CustomEvent("removed", {
                detail: { result: this.result, aborted: this.aborted },
                bubbles: true,
            }));
            this.remove();
        }, 250);
    };

    updatePosition = () => {

        if (!this.parentElement) {
            return;
        }

        const lastParent = this.lastParent = this.parentElement;
        if (!lastParent) {
            return;
        }

        // let start = this.firstElementChild;
        // while(start) {
        //     start.setAttribute("slot", "container");
        //     start = start.nextElementSibling;
        // }

        const cb = getContainingBlock(lastParent) as HTMLElement;
        if (!cb) {
            return;
        }

        (this as any).containingBlock = cb;

        const cbr = cb.getBoundingClientRect();

        const rrSelf = relativeRect(this, cb);

        const rrParent = relativeRect(this.parentElement, cb);

        let anchorBottom = this.getAttribute("anchor-bottom");
        let anchorRight = this.getAttribute("anchor-right");
        let anchorTop = this.getAttribute("anchor-top");
        let anchorLeft = this.getAttribute("anchor-left");


         // auto adjust if the target is outside the
        // container
        const firstChild = this.firstElementChild.getBoundingClientRect();
        let diffTop =  Math.min(window.visualViewport.height, cbr.height) - (rrParent.top + firstChild.height);
        if(diffTop > 0) {
            diffTop = 0;
        } else {
            diffTop -= 40;
            if (anchorTop) {
                anchorBottom = "parent-top";
                anchorTop = void 0;
            }
        }

        let diffBottom = rrParent.top - firstChild.height;
        if (diffBottom > 0) {
            diffBottom = 0;
        }

        const topLeft = {
            "parent-left": `${rrParent.left}px`,
            "parent-right": `${rrSelf.left}px`,
            "parent-top": `${rrParent.top + diffTop}px`,
            "parent-bottom": `${rrParent.top + rrParent.height + diffTop}px`
        };

        const bottomRight = {
            "parent-left": `${rrParent.right}px`,
            "parent-right": `${rrSelf.right}px`,
            "parent-top": `${rrParent.bottom + rrSelf.height + diffBottom}px`,
            "parent-bottom": `${rrParent.bottom + rrParent.height + diffBottom}px`
        };

        

        const style = this.slotElement.style;
        style.removeProperty("left");
        style.removeProperty("top");
        style.removeProperty("right");
        style.removeProperty("bottom");

        if (!anchorBottom) {
            anchorTop ||= "parent-bottom";
        }
        if (!anchorRight) {
            anchorLeft ||= "parent-right";
        }

        if (anchorTop) {
            style.top = topLeft[anchorTop];
        }
        if (anchorLeft) {
            style.left = topLeft[anchorLeft];
        }
        if (anchorBottom) {
            style.bottom = bottomRight[anchorBottom];
        }
        if (anchorRight) {
            style.right = bottomRight[anchorRight];
        }


    };

}

const existingPopup = Symbol("popup");

export interface IAtomPopoverOptions {
    nodeFactory?: (data) => XNode | HTMLElement;
    dataFactory?: () => any;
    "anchor-left"?: "parent-left" | "parent-right";
    "anchor-right"?: "parent-left" | "parent-right";
    "anchor-top"?: "parent-top" | "parent-bottom";
    "anchor-bottom"?: "parent-top" | "parent-bottom";
    closeOnClick?: boolean,
    cancelToken?: CancelToken;
}

export default abstract class AtomPopover<T = any> {

    owner: AtomControl;

    popover: HTMLElement;

    result: any;

    disposables = new AtomDisposableList();

    resultPromise: Promise<T>;
    resultResolve: (value: T | PromiseLike<T>) => void;
    resultReject: (reason?: any) => void;
    parent: HTMLElement;
    popoverContainer: HTMLElement;
    removed: boolean;

    static create(
        parent: HTMLElement | AtomControl,
        options: IAtomPopoverOptions = {},
    ) {
        return parent[existingPopup] ??= new (this as any)(parent, options);
    }

    static show<T1 = any>(
        parent: HTMLElement | AtomControl,
        options: IAtomPopoverOptions = {}
    ) {
        const p: AtomPopover<T1> = (parent[existingPopup] ??= new (this as any)(parent, options));
        return p.resultPromise;
    }

    static menu(
        parent: HTMLElement | AtomControl,
        node: HTMLElement | XNode,
        options: IAtomPopoverOptions = {}
    ) {
        const ct = new CancelToken();
        options.nodeFactory = () => node;
        const p: AtomPopover = new (this as any)(parent, options);
        p.result = 1;
        p.disposables.add(p.owner.bindEvent(p.popover, "click", () => {
            setTimeout(() => {
                ct.cancel();
            }, 10);
        }));
        return p;
    }

    set renderer(v: XNode | HTMLElement) {
        const owner = this.owner;
        let first = this.popoverContainer.firstElementChild as HTMLElement;
        while (first) {
            const next = first.nextElementSibling as HTMLElement;
            owner.dispose(first);
            first.remove();
            first = next;
        }
        if (!v) {
            return;
        }
        if (v[xnodeSymbol]) {
            // @ts-expect-error
            this.owner.render( <div> {v} </div>, this.popoverContainer, this.owner);
        } else {
            this.popoverContainer.appendChild(v as HTMLElement);
        }

        (this.popoverContainer as any).updatePosition?.();
    }

    constructor(
        parent: HTMLElement | AtomControl,
        options: IAtomPopoverOptions = {}
    ) {

        const p1 = parent;
        this.disposables.add(() => p1[existingPopup] = null);

        if (parent instanceof AtomControl) {
            this.owner = parent;
            parent = this.owner.element;
        } else {
            this.owner = AtomControl.from(parent);
        }
        const popover = this.popover = document.createElement("atom-pop-over");
        this.popoverContainer = popover;
        parent.appendChild(popover);

        const {
            cancelToken,
            nodeFactory,
            dataFactory,
            closeOnClick = true,
            "anchor-left": anchorLeft,
            "anchor-right": anchorRight,
            "anchor-top": anchorTop,
            "anchor-bottom": anchorBottom
        } = options;

        cancelToken?.registerForCancel(this.removing as any);

        if (anchorLeft) {
            popover.setAttribute("anchor-left", anchorLeft);
        }
        if(anchorRight) {
            popover.setAttribute("anchor-right", anchorRight);
        }
        if (anchorTop) {
            popover.setAttribute("anchor-top", anchorTop);
        }
        if (anchorBottom) {
            popover.setAttribute("anchor-bottom", anchorBottom);
        }
        
        if (closeOnClick) {
            popover.setAttribute("data-close-on-click", "1");
        }

        popover.addEventListener("removing", this.removing);
        popover.addEventListener("removed", this.remove);
        this.disposables.add(() => {
            popover.removeEventListener("removed", this.remove);
            popover.removeEventListener("removing", this.removing);
        });

        this.init ??= (data) => {
            if (nodeFactory) {
                this.renderer = nodeFactory(data);
            }
        };

        const p = this.init?.(dataFactory?.());
        if (p?.then) {
            p.then(() => void 0, console.warn);
        }

        this.resultPromise = new Promise((resolve, reject) => {
            this.resultResolve = resolve;
            this.resultReject = reject;
        });

        // ignore error
        this.resultPromise.catch(() => void 0);
    }

    abstract init(data?: any);

    close(r) {
        this.removed = true;
        (this.popover as any).result = r ?? null;
        this.popover.remove();
    }

    async cancel() {
        this.removed = true;
        delete (this.popover as any).result;
        this.popover.remove();
    }

    removing = (ce?: Event) => {
        if (this.cancel) {
            ce?.preventDefault();
            const c = this.cancel?.();
            if (c?.then) {
                c.then(() => {
                    this.renderer = void 0;
                    this.remove();
                }, console.warn);
            }
        }
    };

    remove = () => {

        const { result } = this.popover as any;
        if (result === void 0) {
            this.resultReject?.("canceled");
        } else {
            this.resultResolve?.(result);
        }
        
        this.disposables.dispose();
        // dispose
        this.popover.remove();
    }

}

customElements.define("atom-pop-over", AtomPopoverElement);