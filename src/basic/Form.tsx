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

export interface ISubmitAction {
    action: "submit";
    eventClick: any;
}

export interface ICancelAction {
    action: "cancel";
}

export type IFormAction = ISubmitAction | ICancelAction;

/**
 * This is just a decorator, you must have a child button for this to work
 * @param action submit | cancel
 * @param node child node where action will be applied
 * @returns XNode
 */
export function FormAction(action: IFormAction, node: XNode) {
    const attributes = node.attributes ??= {};
    attributes["data-wa-form-action"] = action.action;
    if (action.action === "submit") {
        attributes.eventSubmit = action.eventClick;
    }
    return <div>
        { node }
    </div>;
}

export function SubmitButton(
    { eventClick,
        ... others}: ISubmitButton,
    ... nodes: XNode[]) {
    return <button
        data-wa-form-action="submit"
        eventSubmit={eventClick} { ... others }>{ ... nodes}</button>;
}

function findSubmitAction(e: Event) {
    let button = e.target as HTMLElement;
    if (e.type === "submit") {
        e.preventDefault();
        button = (e as SubmitEvent).submitter;
    }
    while (button) {
        const action = button.dataset.waFormAction;
        if (/submit|cancel/i.test(action)) {
            return { button, action };
        }
        button = button.parentElement;
    }
    return { button };
}

function checkValidity(e: MouseEvent) {
    const form = e.currentTarget as HTMLFormElement;
    const { button, action } = findSubmitAction(e);
    if (!button) {
        return;
    }
    if (action === "cancel") {
        form.dataset.waShowErrors = "";
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

function moveNext(e: KeyboardEvent) {
    if (!/enter|submit|return/i.test(e.key)) {
        return;
    }
    const element = e.target as HTMLElement;
    if (!element.tagName) {
        return;
    }
    if (element.dataset.waFormAction === "submit") {
        element.dispatchEvent(new MouseEvent("click"));
        return;
    }
    if (/input/i.test(element.tagName)) {
        e.preventDefault();
        element.dispatchEvent(new KeyboardEvent("keypress", {
            key: "tab"
        }));
    }
}

export interface IForm {
    class?: any;
    /**
     * By default it is true, when user presses enter button on an input
     * the focus will move on to the next input element
     */
    focusNextOnEnter?: boolean;
    [key: string]: any;
}

export default function Form(
    a: IForm,
    ... nodes: XNode[]) {
    if (a.focusNextOnEnter !== false) {
        a.eventKeypress = moveNext;
    }
    return <form
        data-wa-form="wa-form"
        { ... a}
        eventClick={checkValidity}
        eventSubmit={checkValidity}>
        { ... nodes}
    </form>;
}
