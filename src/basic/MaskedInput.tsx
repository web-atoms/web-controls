import XNode from "@web-atoms/core/dist/core/XNode";
import IElement from "./IElement";

import "./styles/masked-input-style";

export interface IMaskedInput extends IElement {
    mask?: string;
}

const updateMask = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const mask = target.dataset.mask;
    if (!mask) {
        return;
    }

    let result = "";
    const value = target.value;
    // check max length
    for (let index = 0, elementIndex = 0; elementIndex < value.length; elementIndex++, index++) {
        const element = value[elementIndex];
        const maskElement = mask[index];
        switch (maskElement) {
            case "#":
                result += /[0-9]/.test(element) ? element : "";
                continue;
            case ".":
                if (element !== ".") {
                    result += ".";
                }
                result += element;
                break;
        }
    }
    if (target.value !== result) {
        target.value = result;
    }
};

export default function MaskedInput({ mask, ... a}: IMaskedInput) {
    return <input
        data-mask={mask}
        event-change={updateMask}
        event-keypress={updateMask}
        event-keyup={updateMask}
        { ... a}
        />;
}
