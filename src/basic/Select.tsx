import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import IElement from "./IElement.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";

const labelPathSetter = AtomControl.registerProperty("data-items", "value", (ctrl, element, value) => {
    element["labelPath"] = value;
});

const valuePathSetter = AtomControl.registerProperty("data-items", "value", (ctrl, element, value) => {
    element["valuePath"] = value;
});

const valueSetter = AtomControl.registerProperty("data-items", "value", (ctrl, element, value) => {
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

const refreshItems = (element: HTMLSelectElement, items?: any[]) => {
    items ??= element["items"];
    (element as any).update = true;
    const old = element.selectedIndex;
    let cv = element["initialValue"];
    if (old !== -1) {
        cv = element["value"];
    }
    element.options.length = 0;
    const lp = element["labelPath"] ?? ((item) => item?.label ?? item);
    const vp = element["valuePath"] ?? ((item) => item?.value ?? item);
    let i = 0;
    let si = -1;
    if(items?.length) {
        for (const iterator of items) {
            const option = document.createElement("option");
            const label = lp(iterator);
            const value = vp(iterator);
            option.text = label;
            option.value = value;
            element.options.add(option);
            if(cv !== void 0) {
                if (cv == value) {
                    si = i;
                }
            }
            i++;
        }
    }
    if (si != -1) {
        element.selectedIndex = si;
    }
    (element as any).update = false;

};


const itemsSetter = AtomControl.registerProperty("data-items", "value", (ctrl, element: HTMLSelectElement, value) => {
    element["items"] = value;
    setTimeout(refreshItems, 1, element, value);
});

export interface ISelect extends IElement {
    items: any[];
    labelPath?: (item) => any;
    valuePath?: (item) => any;
    value?: any;
}
export default function Select({
        items,
        labelPath,
        valuePath,
        value,
        ... a
    }: ISelect) {
    a[labelPathSetter.property] = labelPath;
    a[valuePathSetter.property] = valuePath;
    a[valueSetter.property] = value;
    a[itemsSetter.property] = items;
    return <select
        { ... a}
        ></select>;
}