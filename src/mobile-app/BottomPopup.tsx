import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { ChildEnumerator } from "@web-atoms/core/dist/web/core/AtomUI";
import PopupService, { IPopupOptions, PopupControl, PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
export * as zDoNotUse from "../animations/Animations";
import MobileApp from "./MobileApp";

CSS(StyleRule()
    .maximizeAbsolute()
    .backgroundColor(Colors.black.withAlphaPercent(0.3))
    .zIndex("500")
    .display("grid")
    .gridTemplateColumns("auto 1fr auto")
    .gridTemplateRows("1fr auto auto auto")
    .child(StyleRule("[data-element=background]")
        .gridRow("2 / span 3")
        .gridColumn("1 / span 3")
        .backgroundColor(Colors.white)
        .zIndex(10)
    )
    .child(StyleRule("[data-element=icon]")
        .gridRow("2")
        .gridColumn("1")
        .marginRight(5)
        .marginBottom(5)
        .zIndex(11)
    )
    .child(StyleRule("[data-element=close]")
        .gridRow("2")
        .gridColumn("3")
        .marginLeft(5)
        .marginBottom(5)
        .zIndex(11)
    )
    .child(StyleRule("[data-element=title]")
        .gridRow("2")
        .gridColumn("2")
        .marginBottom(5)
        .zIndex(11)
    )
    .child(StyleRule("[data-element=content]")
        .gridRow("3")
        .gridColumn("1 / span 3")
        .zIndex(11)
    )
    .child(StyleRule("[data-element=footer]")
        .gridRow("4")
        .gridColumn("1 / span 3")
        .marginTop(5)
        .zIndex(11)
    )
    .and(StyleRule("[data-background=transparent]")
        .backgroundColor(Colors.transparent)
    )
, "div[data-bottom-popup]");

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
        popup.bindEvent(window as any, "backButton", (ce: CustomEvent) => {
            ce.preventDefault();
            return popup.cancelRequested();
        }, void 0, true);
        popup.bindEvent(popup.element, "cancelPopup", () => popup.cancelRequested());
        popup.element.dataset.clickEvent = "cancelPopup";
        current.element.append(popup.element);
        popup.parameters = parameters;
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
    public backgroundRenderer: () => XNode;

    private animate: boolean;

    public dispose(e?: HTMLElement) {
        if (e) {
            super.dispose(e);
            return;
        }
        const element = this.element;
        for (const iterator of ChildEnumerator.enumerate(this.element)) {
            iterator.dataset.animationState = "down";
        }
        setTimeout(() => {
            super.dispose(e);
            element.remove();
        }, 500);
    }

    public async init() {}

    protected preCreate() {
        const element = this.element;
        element.dataset.bottomPopup = "bottom-popup";
        this.animate = true;
        super.preCreate();
        this.backgroundRenderer = () => <div/>;
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
        this.updateElement("background");
        this.updateElement("title");
        this.updateElement("icon");
        this.updateElement("close");
        this.updateElement("footer");
        if (!this.animate) {
            return;
        }
        for (const iterator of ChildEnumerator.enumerate(this.element)) {
            iterator.setAttribute("data-animate-slide", this.animate ? "from-bottom" : "normal");
            iterator.dataset.animationState = "down";
        }
        this.animate = false;
        setTimeout(() => {
            for (const iterator of ChildEnumerator.enumerate(this.element)) {
                iterator.dataset.animationState = "normal";
            }
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
