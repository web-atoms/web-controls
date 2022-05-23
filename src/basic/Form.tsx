import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { ChildEnumerator } from "@web-atoms/core/dist/web/core/AtomUI";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import FormField from "./FormField";
import IElement from "./IElement";
import ToggleButtonBar from "./ToggleButtonBar";
export const FormButtonBar = ToggleButtonBar;

const css = CSS(StyleRule()
    .verticalFlexLayout({ alignItems: "stretch" })
    .displayNone(" .field-error:empty")
    .displayNone(":not([data-wa-show-errors=yes]) .field-error:not(:empty)")
    .child(StyleRule("button")
        .alignSelf("flex-start")
    )
    .and(StyleRule("[data-scrollable=true]")
        .justifyContent("flex-start")
        .overflow("auto")
    )
, "*[data-wa-form=wa-form]");

export interface ISubmitButton {
    eventClick: any;
    class?: string;
    [key: string]: any;
}

export interface ISubmitAction extends IElement {
    action: "submit";
    eventClick?: any;
    "event-click"?: any;
}

export interface ICancelAction extends IElement {
    action: "cancel";
    eventClick?: any;
    "event-click"?: any;
}

export type IFormAction = ISubmitAction | ICancelAction;

/**
 * This is just a decorator, you must have a child button for this to work
 * @param action submit | cancel
 * @param node child node where action will be applied
 * @returns XNode
 */
export function FormAction(
    {
        action = "submit",
        eventClick,
        "event-click": eventClick2,
        ... a
    }: IFormAction,
    node: XNode) {
    const attributes = node.attributes ??= {};
    attributes["data-wa-form-action"] = action;
    const e = attributes["event-click"] || attributes.eventClick;
    if (e) {
        attributes["event-submit"] = e;
        delete attributes["event-click"];
        delete attributes.eventClick;
    }
    eventClick ??= eventClick2;
    if (action === "submit" && eventClick) {
        attributes.eventSubmit = eventClick;
    }
    node.attributes = { ... a, ... attributes};
    return node;
}

/**
 * @deprecated Use Form with eventSubmit and button with data-event="submit"
 */
export function SubmitAction(a: IElement, node: XNode) {
    (a as any).action = "submit";
    return FormAction(a as any, node);
}

/**
 * @deprecated Use Form with eventSubmit and button with data-event="submit"
 */
export function CancelAction(a: IElement, node: XNode) {
    (a as any).action = "cancel";
    return FormAction(a as any, node);
}

/**
 * @deprecated Use Form with eventSubmit and button with data-event="submit"
 */
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
        const action = button.dataset.waFormAction ?? button.dataset.event;
        if (/submit|cancel/i.test(action)) {
            return { button, action };
        }
        button = button.parentElement;
    }
    return { button };
}

const submitFormHandler = (form: HTMLElement) => {
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
        form.dispatchEvent(new CustomEvent("submitForm"));
    }, 100);
};

const checkValidity = (handler) => (e: MouseEvent) => {

    const form = e.currentTarget as HTMLFormElement;

    const { button, action } = findSubmitAction(e);
    if (!button) {
        return;
    }

    if (handler) {
        submitFormHandler(form);
        return;
    }

    // if (button.tagName === "BUTTON" && e.type !== "submit") {
    //     // as submit will be followed, we would ignore this only if the tag is button
    //     return;
    // }
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
};

const moveNext = (handler) => (e: KeyboardEvent) => {
    if (!/enter|submit|return/i.test(e.key)) {
        return;
    }
    const element = e.target as HTMLElement;
    if (!element.tagName) {
        return;
    }
    if  (handler) {
        if (element.tagName !== "TEXTAREA") {
            submitFormHandler(e.currentTarget as HTMLElement);
        }
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
};

document.body.addEventListener("click", (e: MouseEvent) => {
    let start = e.target as HTMLElement;
    let id;
    while (start) {
        id = start.dataset.submitFormId;
        if (id) {
            break;
        }
        start = start.parentElement;
    }
    if (!start) {
        return;
    }
    const form = document.body.querySelector(`[data-form-id="${id}"]`);
    submitFormHandler(form as HTMLElement);
});

export interface IForm {
    id?: number;
    class?: any;
    scrollable?: boolean ;
    /**
     * If set, when an enter key is pressed on
     * non textarea element, form will be submitted automatically
     */
    eventSubmit?: any;
    /**
     * By default it is true, when user presses enter button on an input
     * the focus will move on to the next input element
     */
    focusNextOnEnter?: boolean;
    [key: string]: any;
}

let formId = 0;

const formGroupSymbol = Symbol("formGroup");

export interface IFormGroup {
    group: string;
    // header?: string;
    // icon?: string;
}

export function FormGroup(
    fg: IFormGroup,
    ... nodes: XNode[]
    ) {
    fg[formGroupSymbol] = true;
    return <div
        { ... fg}>
        { ... nodes}
    </div>;
}

export default function Form(
    {
        id = formId++,
        focusNextOnEnter = true,
        scrollable,
        eventSubmit,
        ... a
    }: IForm,
    ... nodes: XNode[]) {
    if (focusNextOnEnter) {
        a.eventKeypress = moveNext(eventSubmit);
    }
    a["data-form-id"] = id;
    a["data-scrollable"] = !!scrollable;
    if (!eventSubmit) {
        a["data-wa-show-errors"] = "yes";
    }

    const fields = [];
    for (const iterator of nodes) {
        if (!iterator) {
            continue;
        }
        const ca = iterator.attributes as any;
        if (ca?.[formGroupSymbol]) {
            for (const child of iterator.children) {
                const cha = child.attributes ??= {};
                cha["data-group"] = ca.group;
                fields.push(child);
            }
            continue;
        }
        fields.push(iterator);
    }
    
    return <div
        data-wa-form="wa-form"
        { ... a}
        eventSubmitForm={eventSubmit}
        eventClick={checkValidity(eventSubmit)}>
        { ... fields}
    </div>;
}

export interface IFormLayout extends IForm {
    header?: XNode;
    footer?: XNode;
}

CSS(StyleRule()
    .display("grid")
    .alignSelf("stretch")
    .justifyContent("stretch" as any)
    .flex("1 1 100%")
    .gridTemplateRows("auto 1fr auto")
    .gridTemplateColumns("1fr")
    .child(StyleRule("[data-element=header]")
        .gridRowStart("1")
    )
    .child(StyleRule("[data-element=content]")
        .gridRowStart("2")
        .overflow("auto")
        .child(StyleRule("div")
            .verticalFlexLayout({ alignItems: "stretch", gap: 10 })
        )
    )
    .child(StyleRule("[data-element=footer]")
        .gridRowStart("3")
    )
, "*[data-form-layout=form-layout]")

export function FormLayout(
    {
        id = formId++,
        focusNextOnEnter = true,
        scrollable,
        eventSubmit,
        header,
        footer,
        ... a
    }: IFormLayout,
    ... nodes: XNode[]) {
    if (focusNextOnEnter) {
        a.eventKeypress = moveNext(eventSubmit);
    }
    a["data-form-id"] = id;
    a["data-scrollable"] = !!scrollable;
    if (!eventSubmit) {
        a["data-wa-show-errors"] = "yes";
    }

    const fields = [];
    for (const iterator of nodes) {
        if (!iterator) {
            continue;
        }
        const ca = iterator.attributes as any;
        if (ca?.[formGroupSymbol]) {
            for (const child of iterator.children) {
                const cha = child.attributes ??= {};
                cha["data-group"] = ca.group;
                fields.push(child);
            }
            continue;
        }
        fields.push(iterator);
    }

    if (header) {
        const ha = header.attributes ??= {};
        ha["data-element"] = "header";
    }
    
    if (footer) {
        const ha = footer.attributes ??= {};
        ha["data-element"] = "footer";
    }

    return <div
        data-wa-form="wa-form"
        data-form-layout="form-layout"
        { ... a}
        eventSubmitForm={eventSubmit}
        eventClick={checkValidity(eventSubmit)}>
        { header }
        <div data-element="content">
            <div>
            { ... fields}
            </div>
        </div>
        { footer }
    </div>;
}

Form.newId = () => formId++;

Form.submitId = (id: number) => ({
    "data-submit-form-id": id.toString()
});
