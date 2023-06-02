import XNode from "@web-atoms/core/dist/core/XNode";
import IElement from "./IElement";

import "./styles/title-editor-style";

export type Capitalize = "none" | "off" | "on" | "sentences" | "words" | "characters";

export interface ITitleEditor extends IElement {
    value?: any;
    type?: any;
    placeholder?: any;
    /**
     * Off - turn off,
     * On - Sentence capitalization
     * Word - Capitalize first character of every word
     * Characters - Capitalize everything
     */
    capitalize?: Capitalize;
}

const paste = (e: ClipboardEvent) => {
    const input = e.target as HTMLInputElement;
    const capitalize = input.autocapitalize as Capitalize;
    if (!capitalize || capitalize === "off" || capitalize === "none") {
        return;
    }
    setTimeout(() => {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        formatText(input, capitalize);
        input.setSelectionRange(start, end);
    }, 1);
};

const formatText = (input: HTMLInputElement, capitalize: Capitalize, all = true) => {
    let value = input.value;
    if (!value) {
        return;
    }
    switch (capitalize) {
        case "on":
        case "sentences":
            if (value.length === 1) {
                value = value.toLocaleUpperCase();
            }
            break;
        case "words":
            if (all) {
                value = value.replace(/(\S+)/g, (s) => s.substring(0, 1).toLocaleUpperCase() + s.substring(1));
            } else {
                value = value.replace(/(\S+)$/g, (s) => s.substring(0, 1).toLocaleUpperCase() + s.substring(1));
            }
            break;
        case "characters":
            value = value.toLocaleUpperCase();
            break;
    }
    input.value = value;
};

const capitalizeText = /android|iPhone|iOS/i.test(navigator.userAgent)
    ? () => undefined
    : (e: InputEvent) => {
    const input = e.target as HTMLInputElement;
    const capitalize = input.autocapitalize as Capitalize;
    if (!capitalize || capitalize === "off" || capitalize === "none") {
        return;
    }
    const start = input.selectionStart;
    const end = input.selectionEnd;
    formatText(input, capitalize, false);
    input.setSelectionRange(start, end);
};

const toText = (capitalize: Capitalize) => {
    switch (capitalize) {
        case "off":
        case "none":
            return "Caps Off";
        case "characters":
            return "All Caps";
        case "on":
        case "sentences":
            return "Sentence";
        case "words":
            return "Title Case";
    }
    return "";
};

const  changeCase = (e: MouseEvent) => {
    let element = e.target as HTMLElement;
    if (element.tagName === "SPAN") {
        element = element.previousElementSibling as HTMLElement;
    }
    const input = element.previousElementSibling as HTMLInputElement;
    const span = element.nextElementSibling;
    let capitalize = input.autocapitalize as Capitalize;
    switch (capitalize) {
        case "sentences":
            capitalize = "words";
            break;
        case "words":
            capitalize = "characters";
            break;
        case "characters":
            capitalize = "off";
            break;
        default:
            capitalize = "sentences";
            break;
    }
    span.textContent = toText(capitalize);
    input.autocapitalize = capitalize;
    // formatText(input, capitalize);
};

export default function TitleEditor({
    value,
    type,
    placeholder,
    capitalize = "on",
    ... a
}: ITitleEditor) {
    return <div
        data-title-editor="title-editor" { ... a}>
        <input
            autocapitalize={capitalize}
            type={type}
            placeholder={placeholder}
            value={value}
            event-input={capitalizeText}
            event-paste={paste}
            />
        <i
            class="fas fa-font-case"
            event-click={changeCase}/>
        <span
            text={toText(capitalize)}
            event-click={changeCase}/>
    </div>;
}
