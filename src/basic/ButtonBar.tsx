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


const valueSetter = AtomControl.registerProperty("data-button-bar-items", "items", (ctrl, element, value) => {
    element["initialValue"] = value;
    element["value"] = value;
    const select = element as HTMLSelectElement;
    let length = select.options.length;
    if (!length) {
        setTimeout(refreshItems, 1, element);
        return;
    }

    // go through all items...
    const items = element["items"];
    if (!items) {
        setTimeout(refreshItems, 1, element);
        return;
    }

    const vp = element["valuePath"] ?? ((item) => item?.value ?? item);
    let index = 0;
    for (const item of items) {
        const v = vp(item);
        if (v == value) {
            select.selectedIndex = index;
            return;
        }
        index++;
    }
    setTimeout(refreshItems, 1, element);
});

const refreshItems = (element: HTMLElement, items?: any[]) => {
    items ??= element["items"];
    (element as any).update = true;
    let cv = element["value"] ?? element["initialValue"];

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

    if(items?.length) {
        for (const iterator of items) {
            const item = document.createElement("label");
            const labelName = name + i;
            const value = vp(item);
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
    (element as any).update = false;

};


const itemsSetter = AtomControl.registerProperty("data-items", "value", (ctrl, element: HTMLSelectElement, value) => {
    element["items"] = value;
    setTimeout(refreshItems, 1, element, value);
});

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
    a[valueSetter.property] = value;
    a[itemsSetter.property] = items;
    a[itemRendererSetter.property] = itemRenderer;
    a[namePathSetter.property] = name;
    return <button-bar
        { ... a}
        ></button-bar>;
}