import Bind from "@web-atoms/core/dist/core/Bind";
import { StringHelper } from "@web-atoms/core/dist/core/StringHelper";
import XNode, { elementFactorySymbol } from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    display: flex;
    flex-direction: column;
    gap: var(--spacing, 5px);

    &[data-valid=true] {
        & .field-error:not(:empty) {
            display: none;
        }
        & > .error-message {
            display: none;
        }
    }

    & > .error-message {
        padding: var(--spacing-small, 2px);
        padding-left: var(--spacing-large, 10px);
        padding-right: var(--spacing-large, 10px);
        background-color: red;
        border-radius: 9999px;
        color: white;
        position: sticky;
    }
`.installGlobal("[data-form=form]");

const checkClick = (e: MouseEvent) => {
    const form = e.currentTarget as HTMLDivElement;
    const target = e.target as HTMLButtonElement;
    if (!/submit/i.test(target.type ?? target.getAttribute("data-type") )) {
        return;
    }
    form.setAttribute("data-show-validation", "true");
    setTimeout(() => {
        const all = Array.from(form.getElementsByClassName("field-error"));
        for (const iterator of all) {
            if (iterator.textContent) {
                form.setAttribute("data-valid", "false");
                return;
            }
        }
        form.setAttribute("data-valid", "true");
        const eventName = StringHelper.fromHyphenToCamel(form.getAttribute("data-submit-event"));
        target.dispatchEvent(new CustomEvent(eventName, { bubbles: true, cancelable: true }));
    }, 100);
};

export interface IForm {
    /**
     * The event that will be dispatched, default is `submitForm`
     */
    "data-submit-event"?: string;
    /**
     * Validation will be displayed if set to true, default is false.
     * It will be set to true if button with type=submit or data-type=submit will be clicked.
     */
    "data-show-validation"?: "true" | "false"
    /**
     * Default error message to be displayed if any field contains error.
     */
    "data-error-message"?: string;

    /**
     * Please change your form style to catch event-submit-form
     */
    eventSubmit?: never;
    /**
     * Please change your form style to catch event-submit-form
     */
    submitCommand?: never;

    [key: string]: any;
}

export default function Form({
    "data-submit-event": submitEvent = "submitForm",
    "data-show-validation": showValidation = "false",
    "data-error-message": errorMessage = "Please fix all validations",
    ... a
}: IForm, ... nodes: XNode[]) {
    return <div
        { ... a}
        data-submit-event={submitEvent}
        data-form="form"
        data-valid="true"
        data-show-validation={showValidation}
        data-error-message={errorMessage}
        event-click={checkClick}>
        <div class="error-message" text={errorMessage}/>
        { ... nodes}
    </div>;
}

type Func = (... p: any[]) => any;

export interface IValidator {
    value: Func;
    message?: (value: string, label: string) => string;
    isValid?: (value: string, element: HTMLElement) => boolean;
}

export const BindError = ({
    value,
    message = (v, l) => `${l} is invalid`,
    isValid = (v, e) => !!v,
}: IValidator) => {
    function f2 (sender, element: HTMLElement) {
        const isRequired = element.parentElement.querySelector(`[data-required]`);
        const msg = value.call(this, sender);
        if (!msg) {
            if (!isRequired) {
                return "";
            }
        }
        if (isValid(msg, element)) {
            return "";
        }
        return message(msg, element.parentElement.querySelector(`[data-element=label]`)?.textContent || "This field ");
    };
    f2.toString = () => value.toString();
    return Bind.oneWay(f2);
}

export const BindEmailError = ({
    value,
    message = (v, l) => `${l} is not a valid email address`,
    isValid = (v, e) => /[^\@]+\@[^\@]+\.[^\@]+/i.test(v),
}: IValidator) => {
    return BindError({ value, message, isValid });
}
