import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import FormField from "./FormField";

const css = CSS(StyleRule()
    .displayNone(" .field-error:empty")
    .displayNone(":not([data-wa-show-errors=yes]) .field-error:not(:empty)")
, "*[data-wa-form=wa-form]");

export interface ISubmitButton {
    eventClick: any;
    class?: string;
    [key: string]: any;
}

export function SubmitButton(
    { eventClick,
        ... others}: ISubmitButton,
    ... nodes: XNode[]) {
    return <button
        data-wa-form-action="submit"
        eventSubmit={eventClick} { ... others }>{ ... nodes}</button>;
}

function checkValidity(e: MouseEvent) {
    const form = e.currentTarget as HTMLFormElement;
    const button = e.target as HTMLElement;
    if (!button.dataset.waFormAction) {
        return;
    }
    if (!form.dataset.waShowErrors) {
        form.dataset.waShowErrors = "yes";
    }

    setTimeout(() => {
        const all = Array.from(form.getElementsByClassName("field-error"));
        for (const iterator of all) {
            if (iterator.textContent) {
                alert(form.dataset?.errorMessage ?? "Please fix all validations");
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
    a: IForm,
    ... nodes: XNode[]) {
    return <form
        data-wa-form="wa-form"
        { ... a}
        eventClick={(e) => checkValidity(e)}>
        { ... nodes}
    </form>;
}
