import type { App } from "@web-atoms/core/dist/App";
import Bind from "@web-atoms/core/dist/core/Bind";
import FormattedString from "@web-atoms/core/dist/core/FormattedString";
import XNode from "@web-atoms/core/dist/core/XNode";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import "./styles/form-field-style";

export interface IFormField {
    label: string | XNode;
    required?: boolean;
    error?: string;
    class?: string;
    helpIcon?: string | boolean;
    help?: string | object;
    helpEventClick?: any;
    /**
     * Display border, it will add an element in the
     * DOM with [data-border=border] which you can
     * customize using CSS
     */
    border?: boolean;
    /**
     * Tooltip displayed on help icon
     */
    helpTitle?: string;
    [key: string]: any;
}

// let id = 1;
// const generateId = (name: string) => {
//     return `${name.replace(/[\W_]+/g, "-")}-${id++}`;
// };

// const associateLabel = AtomControl.registerProperty("assign-label", "for", (ctrl, e, value) => {
//     if (!/TEXTAREA|INPUT/.test(e.tagName)) {
//         return;
//     }

//     if (e.ariaLabel) {
//         return;
//     }

//     // travel up till we find waFormField...
//     let start = e;
//     while (start) {
//         if (start.getAttribute("data-wa-form-field")) {
//             break;
//         }
//         start = start.parentElement;
//     }
//     if (!start) {
//         return;
//     }
//     const label = start.querySelector("label");
//     if (!label) {
//         return;
//     }

//     try {
//         (label as any).control = e;
//     } catch {
//         const eid = e.id ||= generateId(label.textContent);
//         label.htmlFor = eid;
//     }
// });

document.addEventListener("focusin", (e) => {
    let { target } = e as any;
    while (target) {
        if (target.dataset.waFormField === "wa-form-field") {
            target.dataset.focused = "true";
            break;
        }
        target = target.parentElement;
    }
});

document.addEventListener("focusout", (e) => {
    let { target } = e as any;
    while (target) {
        if (target.dataset.waFormField === "wa-form-field") {
            delete target.dataset.focused;
            break;
        }
        target = target.parentElement;
    }
});

export default function FormField(
    {
        label,
        required,
        error,
        helpIcon = "fas fa-question-circle",
        help,
        helpEventClick,
        helpTitle,
        border = false,
        ... others
    }: IFormField,
    node: XNode) {

    if (node) {
        const na = node.attributes ??= {};
        na["data-element"] = "content";
    }

    if (!helpEventClick && help) {
        helpEventClick = Bind.event((s, e) => {
            const app = s.app as App;
            if (typeof help === "string" || help instanceof FormattedString) {
                const ns = app.resolve(NavigationService);
                ns.notify(help);
                return;
            }

            class HelpPopup extends PopupWindow {
                protected create(): void {
                    this.render(<div data-form-field-help="help-window">
                        { help as any}
                    </div>);
                }
            }
            HelpPopup.showWindow({ title : helpTitle ?? "Help", modal: true });
        });
    }

    let labelIsNode = false;

    if (label) {
        if (label instanceof XNode) {
            const la = label.attributes ??= {};
            la["data-element"] = "label";
            labelIsNode = true;
        } else {
            if (node) {
                if (!(node.attributes?.ariaLabel || node.attributes?.["aria-label"])) {
                    (node.attributes ??= {})["aria-label"] = label;
                }
            }
        }
    }

    return <div
        data-wa-form-field="wa-form-field"
        data-border={border}
        { ... others }>
        { label && (labelIsNode ? label : <label data-element="label" text={label}/>) }
        { required && <span
            data-required="required"
            class={required}
            text="*" />}
        { border && <i data-border="border"/>}
        { node }
        { help && <i
                data-help="help"
                class={helpIcon}
                title={helpTitle}
                eventClick={helpEventClick}/>}
        <div
            class="field-error"
            text={error}/>
    </div>;
}

export function HorizontalFormField(
    {
        label,
        required,
        error,
        helpIcon = "fas fa-question-circle",
        help,
        helpEventClick,
        helpTitle,
        border = false,
        ... others
    }: IFormField,
    node: XNode) {

    if (node) {
        const na = node.attributes ??= {};
        na["data-content"] = "content";
    }

    if (!helpEventClick && help) {
        helpEventClick = Bind.event((s, e) => {
            const app = s.app as App;
            if (typeof help === "string" || help instanceof FormattedString) {
                const ns = app.resolve(NavigationService);
                ns.notify(help);
                return;
            }

            class HelpPopup extends PopupWindow {
                protected create(): void {
                    this.render(<div data-form-field-help="help-window">
                        { help as any}
                    </div>);
                }
            }
            HelpPopup.showWindow({ title : helpTitle ?? "Help" });
        });
    }

    if (node) {
        if (!(node.attributes?.ariaLabel || node.attributes?.["aria-label"])) {
            (node.attributes ??= {})["aria-label"] = label;
        }
    }

    return <div
        data-wa-form-field="wa-form-field"
        data-layout="horizontal"
        data-border={border}
        { ... others }>
        { label && <label class="label" text={label}/> }
        { required && <span
            data-required="required"
            class={required}
            text="*" />}
        { border && <i data-border="border"/>}
        { node }
        { help && <i
                data-help="help"
                class={helpIcon}
                title={helpTitle}
                eventClick={helpEventClick}/>}
        <div
            class="field-error"
            text={error}/>
    </div>;
}
