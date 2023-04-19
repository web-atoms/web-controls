import Bind from "@web-atoms/core/dist/core/Bind";
import XNode, { elementFactorySymbol } from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    display: flex;
    flex-direction: column;
    gap: --var(spacing, 5px);
`
.and("[data-valid=true] .field-error:not(:empty)", styled.css `
    display: none;
`).installGlobal("[data-form=form]");

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
                alert(form.dataset?.errorMessage ?? "Please fix all validations");
                form.setAttribute("data-valid", "false");
                return;
            }
        }
        form.setAttribute("data-valid", "true");
        target.dispatchEvent(new CustomEvent(form.getAttribute("data-submit-event")));
    }, 100);
};

export interface IForm2 {
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
}

export default function Form2({
    "data-submit-event": submitEvent = "submitForm",
    "data-show-validation": showValidation = "false",
    "data-error-message": errorMessage = "Please fix all validations",
    ... a
}: IForm2, ... nodes: XNode[]) {
    return <div
        { ... a}
        data-submit-event={submitEvent}
        data-form="form"
        data-valid="true"
        data-show-validation={showValidation}
        data-error-message={errorMessage}
        event-click={checkClick}>
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
    function f2 (sender: { element: HTMLElement }) {
        const element = sender.element;
        const msg = value.call(this, sender);
        if (!msg) {
            const isRequired = element.getAttribute("data-required") === "true";
            if (!isRequired) {
                return;
            }
        }
        if (isValid(msg, element)) {
            return "";
        }
        return message(msg, element.getAttribute("data-label") ?? "this");
    };
    f2.toString = () => value.toString();
    return f2;
}

export const BindEmailError = ({
    value,
    message = (v, l) => `${l} is not a valid email address`,
    isValid = (v, e) => /[^\@]+\@[^\@]+\.[^\@]+/i.test(v),
}: IValidator) => {
    return BindError({ value, message, isValid });
}

export const combineFunction = (fx: Func, message: (text: string, label: string) => string) => {
    function f2 (sender: { element: HTMLElement }) {
        const msg = fx.call(this, sender);
        return message(msg, sender.element.getAttribute("data-label") ?? "this");
    };
    f2.toString = () => fx.toString();
    return f2;
};

export const Validations = {

    isEmpty: (fx) => Bind.oneWay(combineFunction(fx, (s, l) => `${l} is required`))

};