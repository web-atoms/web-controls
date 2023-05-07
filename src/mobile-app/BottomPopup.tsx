import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { ChildEnumerator } from "@web-atoms/core/dist/web/core/AtomUI";
import PopupService, { IPopupOptions, PopupControl, PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
export * as zDoNotUse from "../animations/Animations";
import MobileApp from "./MobileApp";
import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0,0,0,0.3);
    z-index: 500;

    &[data-background=transparent] {
        background-color: #00000000;
    }
    `.installGlobal("*[data-bottom-popup-container]");

    styled.css `
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    margin-left: 2px;
    margin-right: 2px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto auto;
    background-color: #ffffff;
        
    & > [data-element=bar] {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        grid-row: 1;
        grid-column: 1 / span 3;
        background-color: #d3d3d3;
        z-index: 10;
    }
    
    & > [data-element=icon] {
        grid-row: 1;
        grid-column: 1;
        padding: 5px;
        align-self: center;
        margin-right: 5px;
        z-index: 11;
    }
    
    & > [data-element=close] {
        grid-row: 1;
        grid-column: 3;
        padding: 5px;
        margin-left: 5px;
        align-self: center;
        z-index: 11;
    }
    
    & > [data-element=title] {
        grid-row: 1;
        grid-column: 2;
        padding: 5px;
        z-index: 11;
    }
    
    & > [data-element=content] {
        padding: 5px;
        grid-row: 2;
        grid-column: 1 / span 3;
        z-index: 11;
    }
    
    & > [data-element=footer] {
        grid-row: 3;
        grid-column: 1 / span 3;
        margin-top: 5px;
        padding: 5px;
        z-index: 11;
    }
    `.installGlobal("*[data-bottom-popup]");

export interface IBottomPopupOptions extends IPopupOptions {
    parameters?: {[key: string]: any};
}

export default class BottomPopup extends AtomControl {

    public static showModal<T>(options: IBottomPopupOptions) {
        return this.show<T>(options);
    }

    public static async show<T>({
        parameters,
        cancelToken
    }: IBottomPopupOptions = {}): Promise<T> {
        const last = PopupService.lastTarget;
        const current = MobileApp.current;

        const popup = new this(current.app);
        popup.parameters = parameters;
        popup.bindEvent(window as any, "backButton", (ce: CustomEvent) => {
            ce.preventDefault();
            return popup.cancelRequested();
        }, void 0, true);
        popup.bindEvent(popup.element, "cancelPopup", () => popup.cancelRequested());
    
        if (popup.modal) {
            const container = document.createElement("div");
            container.setAttribute("data-bottom-popup-container", "1");
            popup.bindEvent(container, "click", (e) => {
                if (e.target === e.currentTarget) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    popup.element.dispatchEvent(new CustomEvent("cancelPopup"));
                }
            });
            popup.registerDisposable({ dispose: () => {
                container.remove();
            }});
            container.append(popup.element);
            current.element.append(container);
        } else {
            current.element.append(popup.element);
        }

        if (cancelToken) {
            cancelToken.registerForCancel(popup.cancel);
        }
        const result = new Promise<T>((resolve, reject) => {
            let disposed = false;
            popup.close = (r) => {
                if (disposed) {
                    return;
                }
                disposed = true;
                popup.dispose();
                resolve(r);
                PopupService.lastTarget = last;
            };
            popup.cancel = (reason = "cancelled") => {
                if (disposed) {
                    return;
                }
                disposed = true;
                popup.dispose();
                reject(reason);
                PopupService.lastTarget = last;
            };
        });
        const pr = popup.init?.();
        if (pr) {
            try {
                await pr;
            } catch (e) {
                popup.cancel(e);
            }
        }
        return await result;
    }

    public parameters: any;

    public modal: boolean;

    public close: (r?: any) => void;

    public cancel: (reason?: any) => void;

    @BindableProperty
    public titleRenderer: () => XNode;

    @BindableProperty
    public headerRenderer: () => XNode;

    @BindableProperty
    public closeRenderer: () => XNode;

    @BindableProperty
    public footerRenderer: () => XNode;

    @BindableProperty
    public barRenderer: () => XNode;

    /**
     * This will be set to cancelled when popup is closed.
     * You can override cancelRequested method to intercept cancellation.
     */
    public popupCancelToken: CancelToken;

    private animate: boolean;

    public dispose(e?: HTMLElement) {
        if (e) {
            super.dispose(e);
            return;
        }
        const element = this.element;
        this.element.setAttribute("data-animation-state", "down");
        setTimeout(() => {
            super.dispose(e);
            element.remove();
        }, 500);
    }

    public async init() {}

    protected preCreate() {
        this.modal = true;
        const element = this.element;
        element.dataset.bottomPopup = "bottom-popup";
        this.animate = true;
        super.preCreate();
        this.barRenderer = () => <div/>;
        this.popupCancelToken = new CancelToken();
        this.registerDisposable({ dispose: () => {
            this.popupCancelToken.cancel();
        }});
        this.bindEvent(this.element, "closeClick", () => this.cancelRequested());
    }

    protected render(node: XNode, e?: any, creator?: any) {
        this.render = super.render;
        const na = node.attributes ??= {};
        na["data-element"] = "content";
        na["data-click-event"] ??= "popupClick";
        this.render(<div>
            { node }
        </div>);
        this.updateElement("title");
        this.updateElement("bar");
        this.updateElement("icon");
        this.updateElement("close");
        this.updateElement("footer");
        if (!this.animate) {
            return;
        }
        this.element.setAttribute("data-animate-slide", this.animate ? "from-bottom" : "normal");
        this.element.setAttribute("data-animation-state", "down");
        this.animate = false;
        setTimeout(() => {
            this.element.setAttribute("data-animation-state", "normal");
        }, 10);
    }

    protected cancelRequested() {
        return this.cancel();
    }

    protected updateElement(name: string, property: string = name + "Renderer") {
        const r = this[property] as () => XNode;
        const child = ChildEnumerator.find(this.element, (e) => e.dataset.element === name);
        if (child) {
            this.dispose(child);
            child.remove();
        }
        const node = r?.();
        if (!node) {
            return;
        }
        const na = (node.attributes ??= {});
        na["data-element"] = name;
        na["data-click-event"] ??= name + "-click";
        this.render(<div>{node}</div>);
    }

}

delete BottomPopup.prototype.init;
