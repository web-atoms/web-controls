import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import IElement from "./IElement";
import XNode from "@web-atoms/core/dist/core/XNode";

const labelPathSetter = AtomControl.registerProperty("data-items", "value", (ctrl, element, value) => {
    element["labelPath"] = value;
});

const valuePathSetter = AtomControl.registerProperty("data-items", "value", (ctrl, element, value) => {
    element["valuePath"] = value;
});

const valueSetter = AtomControl.registerProperty("data-items", "value", (ctrl, element, value) => {
    element["initialValue"] = value;
    setTimeout(refreshItems, 1, element);
});

const refreshItems = (element: HTMLSelectElement, items?: any[]) => {
    items ??= element["items"];
    (element as any).update = true;
    element.options.length = 0;
    const cv = element["initialValue"];
    const lp = element["labelPath"] ?? ((item) => item?.label ?? item);
    const vp = element["valuePath"] ?? ((item) => item?.value ?? item);
    let i = 0;
    let si = -1;
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
        value
    }: ISelect) {
    const p = {};
    p[labelPathSetter.property] = labelPath;
    p[valuePathSetter.property] = valuePath;
    p[valueSetter.property] = value;
    p[itemsSetter.property] = items;
    return <select
        { ... p}
        ></select>;
}