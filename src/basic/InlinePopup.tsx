import { AtomDisposableList } from "@web-atoms/core/dist/core/AtomDisposableList";
import Colors from "@web-atoms/core/dist/core/Colors";
import sleep from "@web-atoms/core/dist/core/sleep";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule, { ContentAlignType } from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { IPopupOptions } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import IElement from "./IElement";

CSS(StyleRule()
    .position("absolute")
    .borderRadius(5)
    .padding(5)
    .border("solid 1px lightgray")
    .defaultBoxShadow()
    .zIndex(5000)
    .backgroundColor("var(--primary-bg, white)")
, "*[data-inline-popup=inline-popup]");

function closeHandler(
    opener: HTMLElement,
    container: HTMLElement, close) {
    let handler: any = null;
    const body = document.body;
    handler = (e: Event) => {
        let start = e.target as HTMLElement;
        if (e.defaultPrevented) {
            return;
        }
        while (start) {
            if (start === body) {
                break;
            }
            if (start === opener) {
                return;
            }
            if (start === container) {
                return;
            }
            start = start.parentElement;
        }
        close();
        e.preventDefault();
        e.stopImmediatePropagation?.();
    };
    document.body.addEventListener("click", handler, true);
    return () => document.body.removeEventListener("click", handler, true);
}

export interface IInlinePopupOptions extends IPopupOptions {

}

export default class InlinePopup extends AtomControl {

    public static async show<T = void>(
        target: HTMLElement | AtomControl, node: XNode, options: IInlinePopupOptions = {}) {

        const targetElement = ((target as any).element ?? target) as HTMLElement;

        const control = (target as any).element ? target as AtomControl : AtomControl.from(target as any);

        const targetStyle = window.getComputedStyle(targetElement);
        if (!/fixed|absolute|relative/i.test(targetStyle.position)) {
            targetElement.style.position = "relative";
        }

        await sleep(10);

        const container = document.createElement("div");
        container.setAttribute("data-inline-popup", "inline-popup");

        const alignment = options.alignment ?? "bottomLeft";
        switch (alignment) {
            case "bottomLeft":
                container.style.top = `${targetElement.offsetHeight}px`;
                container.style.left = "0px";
                break;
            case "bottomRight":
                container.style.top = `${targetElement.offsetHeight}px`;
                container.style.right = "0px";
                break;
            case "topRight":
                container.style.top = "0px";
                container.style.left = `${targetElement.offsetWidth}px`;
                break;
        }

        container._logicalParent = targetElement;

        // @ts-ignore
        control.render(<div> {node} </div>, container, control);

        targetElement.insertAdjacentElement("beforeend", container);

        return await new Promise<T>((resolve, reject) => {

            const disposables = new AtomDisposableList();

            let resolved = false;

            const close = (r?) => {
                if (resolved) {
                    return;
                }
                resolved = true;
                resolve(r);
                disposables.dispose();
            };

            const cancel = (r = "cancelled") => {
                if (resolved) {
                    return;
                }
                resolved = true;
                reject(r);
                disposables.dispose();
            };

            const defaultClose = options.onClick === "close" ? close : cancel;

            const observer = new MutationObserver(() => {
                if (!container.isConnected) {
                    defaultClose();
                }
            });
            observer.observe(targetElement, { childList: true });
            disposables.add(() => {
                observer.disconnect();
                control.dispose(container);
                container.remove();
            });

            if (options.onClick) {
                disposables.add(control.bindEvent(container, "click", async () => {
                    await sleep(200);
                    defaultClose();
                }));
            }

            options.cancelToken?.registerForCancel(cancel);

            disposables.add(closeHandler(targetElement, container, defaultClose));

        });
    }

}

export interface IInlinePopupButtonOptions extends IElement {
    text?: any;
    label?: any;
    icon?: any;
    hasBorder?: boolean;
    nodes?: XNode[];
    onClick?: "close" | "cancel";
}

CSS(StyleRule()
    .flexLayout({ alignItems: "center", inline: true, justifyContent: "default"})
    .flexWrap("wrap")
    .padding(3)
    .paddingLeft(5)
    .paddingRight(5)
    .and(StyleRule("[data-has-border=false]")
        .border("none")
        .backgroundColor(Colors.transparent)
    )
, "*[data-inline-popup-button=inline-popup-button]");

export function InlinePopupButton(
    {
        text,
        label,
        icon,
        hasBorder = false,
        nodes = [],
        onClick = "close",
        ... a
    }: IInlinePopupButtonOptions,
    ... popupNodes: XNode[]) {
    let isOpen = false;
    const done = () => isOpen = false;
    const click = async (e: MouseEvent) => {
        if (isOpen || e.defaultPrevented) {
            return;
        }
        const popupNode = popupNodes.length > 1 ? <div>{... popupNodes }</div> : popupNodes[0];
        try {
            isOpen = true;
            await InlinePopup.show(
                e.currentTarget as any, popupNode, { onClick });
        } finally {
            done();
        }
    };
    return <button
        event-click={click}
        data-has-border={!!hasBorder}
        data-inline-popup-button="inline-popup-button"
        { ... a}>
        {icon && <i class={icon}/>}
        {text && <span text={text}/>}
        {label && <label text={text}/>}
        { ... nodes}
    </button>;
}
