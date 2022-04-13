import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import IElement from "./IElement";

export interface IMaskedInput extends IElement {
    mask?: string;
}

CSS(StyleRule()
    .position("relative")
    .paddingLeft(2)
    .paddingTop(1)
    .fontFamily("monospace")
    // .and(StyleRule("::after")
    //     .absolutePosition({
    //         left: 2,
    //         top: 1
    //     })
    //     .content("attr(data-mask)" as any)
    //     .fontFamily("inherit")
    //     .fontWeight("inherit")
    //     .fontSize("inherit")
    // )
, "input[data-mask]");

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

document.body.addEventListener("change", updateMask, true);
document.body.addEventListener("keypress", updateMask, true);
document.body.addEventListener("keyup", updateMask, true);

export default function MaskedInput({ mask, ... a}: IMaskedInput) {
    return <input
        data-mask={mask}
        { ... a}
        />;
}
