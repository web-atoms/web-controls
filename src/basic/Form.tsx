import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import FormField from "./FormField";

const css = CSS(StyleRule("form")
    .toggle(".show-errors .field-error", " .field-error")
);

export interface ISubmitButton {
    eventClick: any;
    class?: string;
    [key: string]: any;
}

export function SubmitButton(
    { eventClick,
        class: className,
        ... others}: ISubmitButton,
    ... nodes: XNode[]) {
    return <button
        class={className ? `submit-button ${className}` : "submit-button"}
        eventSubmit={eventClick} { ... others }>{ ... nodes}</button>;
}

function checkValidity(e: MouseEvent) {
    const form = e.currentTarget as HTMLFormElement;
    const button = e.target as HTMLElement;
    if (!button.classList.contains("submit-button")) {
        return;
    }
    if (!form.classList.contains("show-errors")) {
        form.classList.add("show-errors");
    }

    setTimeout(() => {
        const all = Array.from(form.getElementsByClassName("field-error"));
        for (const iterator of all) {
            if (iterator.textContent) {
                alert("Please fix all validations");
                return;
            }
        }
        button.dispatchEvent(new CustomEvent("submit"));
    }, 100);
}


export interface IForm {
    class?: any;
    [key: string]: any;
}

export default function Form(
    {
        class: className,
        ... a
    }: IForm,
    ... nodes: XNode[]) {
    return <form
        class={className ? `${css} ${className}` : css}
        { ... a}
        eventClick={(e) => checkValidity(e)}>
        { ... nodes}
    </form>;
}
