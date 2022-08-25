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

export interface IBottomPopupOptions extends IPopupOptions {
    parameters?: {[key: string]: any};
}

export default class BottomPopup extends AtomControl {

    public static async show<T>({
        parameters,
        cancelToken
    }: IBottomPopupOptions = {}): Promise<T> {
        const popup = new this(MobileApp.current.app);
        popup.bindEvent(window as any, "backButton", (ce: CustomEvent) => {
            ce.preventDefault();
            popup.cancel();
        }, void 0, true);
        popup.bindEvent(popup.element, "cancelPopup", () => {
            popup.cancel();
        });
        popup.element.dataset.clickEvent = "cancelPopup";
        document.body.append(popup.element);
        popup.parameters = parameters;
        if (cancelToken) {
            cancelToken.registerForCancel(popup.cancel);
        }
        const result = new Promise<T>((resolve, reject) => {
            popup.close = (r) => {
                popup.dispose();
                resolve(r);
            };
            popup.cancel = (reason = "cancelled") => {
                popup.dispose();
                reject(reason);
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

    public async init() {}

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
        na["data-click-event"] ??= "popupClick";
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

delete BottomPopup.prototype.init;
