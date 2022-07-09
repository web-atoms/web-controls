import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { IPopupOptions, PopupControl } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
export * as zDoNotUse from "../animations/Animations";
import MobileApp from "./MobileApp";

CSS(StyleRule()
    .maximizeAbsolute()
    .backgroundColor(Colors.black.withAlphaPercent(0.3))
    .zIndex("50000")
    .child(StyleRule("[data-element=content]")
        .backgroundColor(Colors.white)
        .absolutePosition({
            left: 0,
            right: 0,
            bottom: 0
        })
    )
, "div[data-bottom-popup]");

export default class BottomPopup extends AtomControl {

    public static show<T>(): Promise<T> {
        return new Promise((resolve, reject) => {
            const popup = new this(MobileApp.current.app);
            popup.close = (r) => {
                popup.dispose();
                resolve(r);
            };
            popup.cancel = (reason = "cancelled") => {
                popup.dispose();
                reject(reason);
            };
            popup.bindEvent(window as any, "backButton", (ce: CustomEvent) => {
                ce.preventDefault();
                popup.cancel();
            }, void 0, true);
            popup.bindEvent(popup.element, "cancelPopup", () => {
                popup.cancel();
            });
            popup.element.dataset.clickEvent = "cancelPopup";
            document.body.append(popup.element);
        });
    }

    public close: (r?: any) => void;

    public cancel: (reason?: any) => void;

    public dispose(e?: HTMLElement) {
        if (e) {
            super.dispose(e);
            return;
        }
        const element = this.element;
        const child = element?.firstElementChild as HTMLElement;
        child.dataset.animationState = "down";
        setTimeout(() => {
            super.dispose(e);
            element.remove();
        }, 500);
    }

    protected preCreate() {
        const element = this.element;
        element.dataset.bottomPopup = "bottom-popup";
        super.preCreate();
    }

    protected render(node: XNode, e?: any, creator?: any) {
        this.render = super.render;
        const na = node.attributes ??= {};
        na["data-animate-slide"] = "from-bottom";
        na["data-element"] = "content";
        this.render(<div>
            { node }
        </div>);
        const child = this.element.firstElementChild as HTMLElement;
        child.dataset.animationState = "down";
        setTimeout(() => {
            child.dataset.animationState = "normal";
        }, 10);
    }

}
