import { App } from "@web-atoms/core/dist/App";
import Colors from "@web-atoms/core/dist/core/Colors";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { IPopupOptions } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

CSS(StyleRule()
    .position("absolute")
    .height(0)
    .width(0)
    .left(0)
    .child(StyleRule("*")
        .position("absolute")
        .left(0)
        .top(0)
        .maxHeight(200)
        .padding(5)
        .borderRadius(5)
        .backgroundColor(Colors.white)
        .defaultBoxShadow()
    )
, "*[data-inline-popup=true]");

function closeHandler(
    host: HTMLElement,
    opener: HTMLElement,
    container, close) {
    let handler: any = null;
    handler = (e: Event) => {
        let start = e.target as HTMLElement;
        if (e.defaultPrevented) {
            return;
        }
        while (start) {
            if (start === host) {
                break;
            }
            if (start === opener) {
                return;
            }
            if (start === container.element) {
                return;
            }
            start = start.parentElement;
        }
        close();
    };
    document.body.addEventListener("click", handler);
    container.registerDisposable(() => document.body.removeEventListener("click", handler));
}

export default class InlinePopupControl extends AtomControl {

    public static showControl<T>(
        opener: HTMLElement | AtomControl,
        options: IPopupOptions = {}
    ) {
        return new Promise<T>((resolve, reject) => {
            let openerElement: HTMLElement = options?.parentElement;
            let app: App;
            if (opener instanceof AtomControl) {
                openerElement ??= opener.element;
                app = opener.app;
            } else {
                openerElement ??= opener;
                let start = opener;
                while (!start.atomControl) {
                    start = start.parentElement;
                }
                if (!start) {
                    return Promise.reject("Could not create popup as target is not attached");
                }
                app = start.atomControl.app;
            }
            const popup = new this(app);
            const container = document.createElement("div");
            container.dataset.inlinePopup = "true";

            container.appendChild(popup.element);
            if (openerElement.offsetParent !== openerElement.parentElement) {
                openerElement.parentElement.style.position = "relative";
            }
            setTimeout(() => {
                container.style.top = (openerElement.offsetTop + openerElement.offsetHeight) + "px";
                openerElement.insertAdjacentElement("afterend", container);
            }, 50);

            let resolved = false;
            const { cancelToken } = options;
            if (cancelToken) {
                cancelToken.registerForCancel((r) => {
                    popup.cancel(r);
                });
            }
            popup.close = (r) => {
                if (resolved) {
                    return;
                }
                resolved = true;
                resolve(r);
                popup.dispose();
                container.remove();
            };
            popup.cancel = (r = "cancelled") => {
                if (resolved) {
                    return;
                }
                resolved = true;
                reject(r);
                popup.dispose();
                container.remove();
            };

            closeHandler(openerElement.parentElement, openerElement, popup, popup.cancel);
        });
    }

    public close(r?) {}

    public cancel(r?) {

    }

}
