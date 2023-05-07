import { App } from "@web-atoms/core/dist/App";
import { AtomDisposableList } from "@web-atoms/core/dist/core/AtomDisposableList";
import Colors from "@web-atoms/core/dist/core/Colors";
import sleep from "@web-atoms/core/dist/core/sleep";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule, { ContentAlignType } from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl, ElementValueSetters } from "@web-atoms/core/dist/web/controls/AtomControl";
import { IPopupOptions } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import IElement from "./IElement";

import "./styles/inline-popup-style";

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

    let ce = container as HTMLElement;
    const containNoneList: HTMLElement[] = [];
    while (ce) {
        const isNotNone = window.getComputedStyle(ce).contain !== "none";
        if (isNotNone) {
            ce.setAttribute("data-force-contain", "none");
            containNoneList.push(ce);
        }
        ce = ce.parentElement;
    }

    return () => {
        document.body.removeEventListener("click", handler, true);
        for (const iterator of containNoneList) {
            iterator.removeAttribute("data-force-contain");
        }
    };
}

export interface IInlinePopupOptions extends IPopupOptions {
    defaultOnClick?: "close" | "cancel" | null | undefined;
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

        const alignment = options.alignment ?? "none";
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
            default:
                container.style.top = `${targetElement.offsetHeight}px`;
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

            const firstChild = (container.firstElementChild as HTMLElement).atomControl;

            if (firstChild instanceof InlinePopup) {
                firstChild.cancel = cancel;
                firstChild.close = close;
            } else {
                if (options.onClick === void 0) {
                    options.onClick = options.defaultOnClick;
                }
            }

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

    public static showControl<T>(target: HTMLElement | AtomControl, options: IPopupOptions = {}) {
        const node = XNode.create(this, {});
        return this.show<T>(target, node, options);
    }

    public close: (r?) => void;

    public cancel: (r?) => void;

    protected dispatchClickEvent(e: MouseEvent, data: any) {
        let start = this.element.parentElement;
        while (start) {
            const atomControl = AtomControl.from(start);
            if (atomControl) {
                (atomControl as any).dispatchClickEvent(e, data);
                return;
            }
            start = start.parentElement;
        }
        super.dispatchClickEvent(e, data);
    }
}

export interface IInlinePopupButtonOptions extends IElement {
    text?: any;
    label?: any;
    icon?: any;
    hasBorder?: boolean;
    nodes?: XNode[];
    defaultOnClick?: "close" | "cancel";
    anchorRight?: boolean;
    popup?: PopupFactory;
}

CSS(StyleRule()
    .flexLayout({ alignItems: "center", inline: true, justifyContent: "center"})
    .flexWrap("wrap")
    .padding(3)
    .paddingLeft(5)
    .paddingRight(5)
    .and(StyleRule("[data-has-border=false]")
        .border("none")
        .backgroundColor(Colors.transparent)
    )
, "*[data-inline-popup-button=inline-popup-button]");

export type PopupFactory = (data) => XNode;

document.body.addEventListener("click", (e) => {

    let start = e.target as HTMLElement;
    let popupFactory: PopupFactory;
    let alignment;
    while (start) {
        popupFactory = (start as any).popupFactory;
        if (popupFactory) {

            alignment = start.dataset.alignment;
            // stop...
            break;
        }
        start = start.parentElement;
    }

    if (!start) {
        return;
    }

    const control = AtomControl.from(start) as any;
    const app = control.app as App;
    const target = start;
    const element = control.element;
    let itemIndex;
    let data;
    if (control.items && control.itemRenderer) {
        // this is atom repeater
        while (start && start !== element) {
            itemIndex ??= start.dataset.itemIndex;
            if (itemIndex) {
                data = control.items[itemIndex];
                break;
            }
            start = start.parentElement;
        }
    }

    if (!data) {
        data = new Proxy(target, {
            get(t, p, receiver) {
                let s = target;
                while (s) {
                    const v = s.dataset[p as string];
                    if (v !== void 0) {
                        return v;
                    }
                    s = s.parentElement;
                }
            },
        });
    }

    const node = popupFactory(data);

    app.runAsync(() => InlinePopup.show(target, node, { alignment }));

});

ElementValueSetters["data-popup-class"] =  (c, e, v) => {
    (e as any).popupFactory = v;
};

export function InlinePopupButton(
    {
        text,
        label,
        icon,
        hasBorder = false,
        nodes = [],
        defaultOnClick = "close",
        anchorRight = false,
        popup,
        ... a
    }: IInlinePopupButtonOptions,
    ... popupNodes: XNode[]) {

    if (popup) {
        return <button
            data-popup-class={popup}
            data-has-border={!!hasBorder}
            data-inline-popup-button="inline-popup-button"
            data-alignment={anchorRight ? "bottomRight" : "bottomLeft"}
            { ... a}>
            {icon && <i class={icon}/>}
            {text && <span text={text}/>}
            {label && <label text={text}/>}
            { ... nodes}
        </button>;
    }

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
                e.currentTarget as any, popupNode, { defaultOnClick });
        } finally {
            done();
        }
    };
    return <button
        event-click={click}
        data-has-border={!!hasBorder}
        data-alignment={anchorRight ? "bottomRight" : "bottomLeft"}
        data-inline-popup-button="inline-popup-button"
        { ... a}>
        {icon && <i class={icon}/>}
        {text && <span text={text}/>}
        {label && <label text={text}/>}
        { ... nodes}
    </button>;
}
