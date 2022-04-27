import XNode from "@web-atoms/core/dist/core/XNode";
import { getParentRepeaterItem } from "./AtomRepeater";
import IElement from "./IElement";

type Getter = (item) => any;

export interface IPropertyInfo {
    key?: string,
    getter(item): any;
    setter(item, value): void;
}

export function getPropertyInfo(propertyPath: string[] | string | IPropertyInfo): IPropertyInfo {
    if (typeof propertyPath === "string") {
        return {
            key: propertyPath,
            getter: (item) => item?.[propertyPath],
            setter: (item, value) => {
                if (item) {
                    item[propertyPath] = value;
                }
            }
        }
    }
    if (!Array.isArray(propertyPath)) {
        return propertyPath;
    }
    const last = propertyPath.pop();
    let getterIntermediate = undefined;
    if (propertyPath.length > 0) {
        getterIntermediate = function(item) {
            if (!item) {
                return item;
            }
            for (const iterator of propertyPath) {
                item = item[iterator];
                if (!item) {
                    return item;
                }
            }
            return item;
        }
    }
    let setter = (item, value) => {
        if (item) {
            if (getterIntermediate) {
                item = getterIntermediate(item)
            }
            if (item) {
                item[last] = value;
            }
        }
    }
    let getter = (item) => {
        if (!item) {
            return item;
        }
        if (getterIntermediate) {
            item = getterIntermediate(item);
        }
        return item?.[last];
    };
    return {
        key: propertyPath.join(","),
        getter,
        setter
    }
}

const handlers = {};

function registerEvent(property: IPropertyInfo, changeEvents: string[], editorValuePath: (editor) => any) {
    property.key ??= property.setter + ":" + property.getter;
    const name = `${property.key}:${changeEvents.join(",")}`;
    if(!handlers[name]) {
        handlers[name] = changeEvents;
        for (const iterator of changeEvents) {
            document.body.addEventListener(iterator, (e) => {
                setTimeout(() => {
                    const ri = getParentRepeaterItem(e.target as HTMLElement);
                    if (!ri) {
                        return;
                    }
                    const [ _, repeater, item] = ri;
                    const oldValue = property.getter(item);
                    const value = editorValuePath(e.target);
                    if (oldValue != value) {
                        property.setter(item, value);
                        repeater.refreshItem(item);
                    }
                }, 1);
            }, true);
        }
    }
}


export interface IEditable extends IElement {
    propertyPath: string[] | string | IPropertyInfo;
}

export default function Editable(
    {
        propertyPath
    }: IEditable
) {

}

export function EditableInput(
    {
        propertyPath,
        ... a
    }: IEditable
) {
    if (typeof propertyPath === "string" || Array.isArray(propertyPath)) {
        propertyPath = getPropertyInfo(propertyPath);
    }
    registerEvent(propertyPath, ["change", "blur"], (item) => item.value);
    return <input
        type="text"
        { ... a} />;
}
