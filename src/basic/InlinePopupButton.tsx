import XNode from "@web-atoms/core/dist/core/XNode.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import { App } from "@web-atoms/core/dist/App.js";
import AtomPopover, { IAnchorPopover } from "./elements/AtomPopover.js";

export type PopupFactory = (data) => XNode;

export interface IPopupButton extends IAnchorPopover {
    icon?: string;
    text?: string;
    label?: string;
    popup?: PopupFactory;
    closeOnClick?: boolean;
    [k: string]: any;
}



export default function InlinePopupButton( { icon, text, label, closeOnClick = true, popup, ... a }: IPopupButton, ... nodes: XNode[]) {
    if(!a["anchor-right"]) {
        a["anchor-left"] ??= "parent-right";
    }
    if (!a["anchor-bottom"]) {
        a["anchor-top"] ??= "parent-top";
    }
    a["data-atom-popup-button"] = "popup-button";
    if (!popup) {
        const copy = nodes;
        const div = <div>{ ... copy }</div>;
        popup = () => div;
        nodes = [];
    }
    a["popupFactory"] = popup;

    if (closeOnClick) {
        a["data-close-on-click"] = true;
    }

    if(!a["data-layout"]) {
        if (icon && text) {
            a["data-layout"] = "icon-button";
        } else {
            a["data-layout"] = "button";
        }
    }

    return <button data-atom-popup-button="1" { ... a}>
        {icon && <i class={icon}/>}
        {text && <span text={text}/>}
        {label && <label text={text}/>}
        { ... nodes }
    </button>;
}

document.body.addEventListener("click", (e) => {
    let start = e.target as HTMLElement;
    while(start) {
        if(start.hasAttribute("data-atom-popup-button")) {
            break;
        }
        start = start.parentElement as HTMLElement;
    }

    if (!start) {
        return;
    }

    const pf = start["popupFactory"] as PopupFactory;
    if (!pf) {
        return;
    }

    const control = AtomControl.from(start) as any;
    const app = control.app as App;
    const target = start;
    const element = control.element;

    const dataFactory = () => {

        let itemIndex;

        let data;


        if (control.items && control.itemRenderer) {
            // this is atom repeater
            while (start && start !== element) {
                itemIndex ??= start.getAttribute("data-item-index");
                if (itemIndex) {
                    data = control.items[~~itemIndex];
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
        return data;
    };

    let closeOnClick = void 0;
    const dataCloseOnClick = target.getAttribute("data-close-on-click");
    if (dataCloseOnClick) {
        closeOnClick = /^(true|yes|1)$/i.test(dataCloseOnClick);
    }

    AtomPopover.create(target, {
        nodeFactory: (data) => pf(data),
        dataFactory,
        closeOnClick,
        "anchor-bottom": target.getAttribute("anchor-bottom") as any,
        "anchor-top": target.getAttribute("anchor-top") as any,
        "anchor-left": target.getAttribute("anchor-left") as any,
        "anchor-right": target.getAttribute("anchor-right") as any,
    });
})
