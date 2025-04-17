const testNode = (node) => {
    let test; let cs = getComputedStyle(node);
    test = cs.getPropertyValue('position'); if ([
        'absolute', 'fixed'
    ].includes(test)) { return true; }
    test = cs.getPropertyValue('transform');   if (test != 'none')  { return true; }
    test = cs.getPropertyValue('perspective'); if (test != 'none')  { return true; }
    test = cs.getPropertyValue('perspective'); if (test != 'none')  { return true; }
    test = cs.getPropertyValue('filter');      if (test != 'none')  { return true; }
    test = cs.getPropertyValue('contain');     if (test == 'paint') { return true; }
    test = cs.getPropertyValue('will-change'); if ([
        'transform', 'perspective', 'filter'
    ].includes(test)) { return true; }
    return false;
}

const getContainingBlock = (node) => {
    if (node.parentElement) {
        if (node.parentElement == document.body) {
            return document.body;
        } else if (testNode(node.parentElement) == false) {
            return getContainingBlock(node.parentElement);
        } else { return node.parentElement; }
    } else { return null; }
}

import { AtomDisposableList } from "@web-atoms/core/dist/core/AtomDisposableList";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import XNode, { IElementAttributes, xnodeSymbol } from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import "./AtomPopover.css";

interface IAnchorPopover extends IElementAttributes {
    "anchor-left": "parent-left" | "parent-right",
    "anchor-right": "parent-left" | "parent-right",
    "anchor-top": "parent-top" | "parent-bottom",
    "anchor-bottom": "parent-top" | "parent-bottom"
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

    connectedCallback() {

        // set defaults...

        setInterval(this.updatePosition, 1000);
        setTimeout(() => {
            window.addEventListener("click", this.closePopover);
        }, 10);
        this.updatePosition();
    }

    disconnectedCallback() {

        if(this.lastParent?.isConnected) {
            this.dispatchEvent(new CustomEvent("removed", {
                detail: { result: this.result, aborted: this.aborted },
                bubbles: true
            }));
        }

        window.removeEventListener("click", this.closePopover);
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
                if(target === this) {
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
        }, 10);
    };

    updatePosition = () => {

        if (!this.parentElement) {
            clearInterval(this.timer);
            return;
        }

        const lastParent = this.lastParent = this.parentElement;
        if (!lastParent) {
            return;
        }

        const cb = getContainingBlock(lastParent) as HTMLElement;
        if (!cb) {
            return;
        }

        const rect = this.getBoundingClientRect();

        const cbr = cb.getBoundingClientRect();

        const l = rect.x - cbr.x;
        const t = rect.y - cbr.y;

        const r = l + rect.width;
        const b = t + rect.height;

        const a = {
            "parent-left": `${l}px`,
            "parent-right": `${r}px`,
            "parent-top": `${t}px`,
            "parent-bottom": `${b}px`
        };

        
        let anchorBottom = this.getAttribute("anchor-bottom");
        let anchorRight = this.getAttribute("anchor-right");
        let anchorTop = this.getAttribute("anchor-top");
        let anchorLeft = this.getAttribute("anchor-left");

        const style = (this.firstElementChild as HTMLElement).style;
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
            style.top = a[anchorTop];
        }
        if (anchorBottom) {
            style.bottom = a[anchorBottom];
        }
        if (anchorLeft) {
            style.left = a[anchorLeft];
        }
        if (anchorRight) {
            style.right =a[anchorRight];
        }


    };

}

const existingPopup = Symbol("popup");

export default abstract class AtomPopover<T = any> {

    owner: AtomControl;

    popover: HTMLElement;

    result: any;

    disposables = new AtomDisposableList();

    resultPromise: Promise<T>;
    resultResolve: (value: T | PromiseLike<T>) => void;
    resultReject: (reason?: any) => void;
    parent: HTMLElement;
    popoverContainer: HTMLDivElement;

    static create(
        parent: HTMLElement | AtomControl,
        node: HTMLElement | XNode,
        cancelToken?: CancelToken
    ) {

        return parent[existingPopup] ??= new (this as any)(parent, cancelToken, node);
    }

    static show(
        parent: HTMLElement | AtomControl,
        cancelToken?: CancelToken
    ) {
        return parent[existingPopup] ??= new (this as any)(parent, cancelToken);
    }

    static menu(
        parent: HTMLElement | AtomControl,
        node: HTMLElement | XNode
    ) {
        const ct = new CancelToken();
        const p: AtomPopover = new (this as any)(parent, ct, node);
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
    }

    constructor(
        parent: HTMLElement | AtomControl,
        cancelToken?: CancelToken,
        node?: HTMLElement | XNode
    ) {

        const p1 = parent;
        this.disposables.add(() => p1[existingPopup] = null);

        if (parent instanceof AtomControl) {
            this.owner = parent;
            parent = this.owner.element;
        }
        this.popover = document.createElement("atom-pop-over");
        const container = document.createElement("div");
        container.className = "container";
        this.popoverContainer = container;
        this.popover.appendChild(container);
        parent.appendChild(this.popover);

        cancelToken?.registerForCancel(this.removing as any);

        this.popover.addEventListener("removing", this.removing);
        this.popover.addEventListener("removed", this.remove);
        this.disposables.add(() => {
            this.popover.removeEventListener("removed", this.remove);
            this.popover.removeEventListener("removing", this.removing);
        });

        this.init ??= () => {
            if (node) {
                this.renderer = node;
            }
        };

        const p = this.init?.();
        if (p?.then) {
            p.then(() => void 0, console.warn);
        }

        this.resultPromise = new Promise((resolve, reject) => {
            this.resultResolve = resolve;
            this.resultReject = reject;
        });
    }

    abstract init();

    close(r) {
        (this.popover as any).result = r ?? null;
        this.popover.remove();
    }

    async cancel() {}

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
            this.resultReject?.();
        } else {
            this.resultResolve?.(result);
        }
        
        this.disposables.dispose();
        // dispose
        this.popover.remove();
    }

}

delete AtomPopover.prototype.cancel;

customElements.define("atom-pop-over", AtomPopoverElement);