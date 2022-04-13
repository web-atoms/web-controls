import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import IElement from "./IElement";

export interface IMaskedInput extends IElement {
    mask?: string;
}

CSS(StyleRule()
    .display("inline")
    .position("relative")
    .paddingLeft(2)
    .paddingTop(2)
    .fontFamily("monospace")
    .and(StyleRule("::before")
        .absolutePosition({
            left: 2,
            top: 2
        })
        .content("attr(data-label)" as any)
        .fontFamily("inherit")
        .fontWeight("inherit")
        .fontSize("inherit")
        .pointerEvents("none")
    )
    .and(StyleRule("::after")
        .absolutePosition({
            left: 2,
            top: 2
        })
        .content("attr(data-mask)" as any)
        .fontFamily("inherit")
        .fontWeight("inherit")
        .fontSize("inherit")
        .pointerEvents("none")
        .opacity("0.2")
    )
    .child(StyleRule("input")
        .color(Colors.transparent)
        .caretColor(Colors.gray)
        .fontFamily("inherit")
        .fontWeight("inherit")
        .fontSize("inherit")
    )
, "div[data-mask]");

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
                result += /[0-9]/.test(element) ? element : "0";
                continue;
            case ".":
                if (element !== ".") {
                    result += ".";
                }
                result += element;
                break;
            default:
                result += element;
                break;
        }
    }
    target.parentElement.dataset.label = result;
};

document.body.addEventListener("change", updateMask);
document.body.addEventListener("keypress", updateMask);
document.body.addEventListener("keyup", updateMask);

const maskProperty = AtomControl.registerProperty(
    "data-mask", "format", (ctrl: AtomControl, e: HTMLElement, value: any) => {
    if (!value) {
        e.dataset.label = "";
        return;
    }
    let result = "";
    for (const iterator of value) {
        switch (iterator) {
            case "#":
                result += " ";
                continue;
            case "0":
                result += "0";
                continue;
            default:
                result += iterator;
                continue;
        }
    }
    e.dataset.label = result;
});

export default function MaskedInput({ mask, ... a}: IMaskedInput) {
    return <div
            data-mask={mask}
            { ... maskProperty(mask) }
            >
            <input
            data-mask={mask}
            { ... a}
            />
        </div>;
}
