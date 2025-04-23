import XNode, { constructorNeedsArgumentsSymbol, IElementAttributes } from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import IElement from "./IElement";

import "./ButtonBar.global.css";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "button-bar": IElementAttributes;
        }
    }
}

let nid = 1;

const labelPathSetter = AtomControl.registerProperty("data-button-bar-items", "label", (ctrl, element, value) => {
    element["labelPath"] = value;
});

const valuePathSetter = AtomControl.registerProperty("data-button-bar-items", "value", (ctrl, element, value) => {
    element["valuePath"] = value;
});


const namePathSetter = AtomControl.registerProperty("data-button-bar-items", "name", (ctrl, element, value) => {
    element["namePath"] = value;
});

const itemRendererSetter = AtomControl.registerProperty("data-button-bar-items", "renderer", (ctrl, element, value) => {
    element["itemRenderer"] = value;
});

const refreshItems = (element: HTMLElement, items?: any[]) => {
    items ??= element["items"];

    const lp = element["labelPath"] ?? ((item) => item?.label ?? item);
    const vp = element["valuePath"] ?? ((item) => item?.value ?? item);
    const ir = element["itemRenderer"] ?? ((item) => <div text={lp(item)}/>);
    const name = element["namePath"];
    let i = 0;

    const all = Array.from(element.querySelectorAll(`label`));
    for (const element of all) {
        element.remove();
    }

    const control = AtomControl.from(element);

    const hidden = element.querySelector(`input.hidden`) as HTMLInputElement;
    const cv = hidden.value;

    if(items?.length) {
        for (const iterator of items) {
            const item = document.createElement("label");
            const labelName = name + i;
            const value = vp(iterator);
            let checked = false;
            if(cv !== void 0) {
                if (cv == value) {
                    checked = true;
                }
            }
            item.setAttribute("for", labelName);
            element.appendChild(item);
            // @ts-expect-error
            control.render(<div> <input id={labelName} type="radio" name={name} value={value} checked={checked} /> { ir(iterator) }</div>, item, control);
            i++;
        }
    }
};


const itemsSetter = AtomControl.registerProperty("data-items", "value", (ctrl, element: HTMLSelectElement, value) => {
    element["items"] = value;
    ctrl.runAfterInit(() => setTimeout(refreshItems, 1, element, value));
});

const changeTracker = (e: CustomEvent) => {
    if (e.detail) {
        return;
    }
    const target = e.currentTarget as HTMLElement;
    const hidden = target.querySelector(`input.hidden`) as HTMLInputElement;
    const buttons = target.querySelectorAll(`input[type="radio"]`);
    for (let index = 0; index < buttons.length; index++) {
        const element = buttons[index] as HTMLInputElement;
        if (element.checked) {
            hidden.value = element.value;
            hidden.dispatchEvent(new CustomEvent("change", { detail: element.value, bubbles: true }));
            break;
        }
    }
};

export interface IButtonBar extends IElement {
    items: any[];
    labelPath?: (item) => any;
    valuePath?: (item) => any;
    itemRenderer?: (item) => XNode;
    value?: any;
    name?: string;
}
export default function ButtonBar({
        items,
        labelPath,
        valuePath,
        itemRenderer = (x) => <div text={x.label ?? x}/>,
        value,
        name = `button-bar-${nid++}`,
        ... a
    }: IButtonBar) {
    a[labelPathSetter.property] = labelPath;
    a[valuePathSetter.property] = valuePath;
    a[itemsSetter.property] = items;
    a[itemRendererSetter.property] = itemRenderer;
    a[namePathSetter.property] = name;
    a["event-change"] = changeTracker;
    return <button-bar
        { ... a}
        >
        <input class="hidden" value={value}/>
    </button-bar>;
}