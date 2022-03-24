import type { App } from "@web-atoms/core/dist/App";
import Bind from "@web-atoms/core/dist/core/Bind";
import Colors from "@web-atoms/core/dist/core/Colors";
import FormattedString from "@web-atoms/core/dist/core/FormattedString";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import PopupService, { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

export interface IFormField {
    label: string;
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

const css = CSS(StyleRule()
    .display("grid")
    .alignItems("center")
    .gridTemplateColumns("auto 1fr auto auto")
    .gridTemplateRows("auto auto auto")
    .child(StyleRule("[data-content=content]")
        .gridRowStart("2")
        .gridColumnStart("1")
        .gridColumnEnd("span 2")
        .marginTop(5)
        .marginBottom(5)
    )
    .and(StyleRule("[data-border=true]")
        .nested(StyleRule("input")
            .border("none")
            .outline("none")
        )
        .nested(StyleRule("textarea")
            .border("none")
            .outline("none")
        )
        .nested(StyleRule("select")
            .border("none")
        )
    )
    .child(StyleRule("i[data-border=border]")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .gridRowStart("3")
        .alignSelf("flex-end")
        .borderBottomStyle("solid")
        .borderBottomWidth("1px")
        .borderBottomColor(Colors.lightGray)
    )
    .and(StyleRule("[data-focused=true]")
            .child(StyleRule("i[data-border=border]")
            .borderBottomColor(Colors.black)
        )
    )
    .child(StyleRule("i[data-help=help]")
        .gridRowStart("2")
        .gridColumnStart("3")
        .padding(5)
        .fontSize("x-large")
        .cursor("pointer")
        .marginLeft("auto")
        .color(Colors.lightGreen)
    )
    .child(StyleRule(".field-error")
        .gridRowStart("4")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .padding(5)
        .margin(5)
        .borderRadius(9999)
        .backgroundColor(Colors.red)
        .color(Colors.white)
        .fontSize("smaller")
        .and(StyleRule(":empty")
            .display("none")
        )
    )
    .child(StyleRule("span[data-required=required]")
        .gridColumnStart("2")
        .visibility("hidden")
        .color(Colors.red)
        .and(StyleRule(".true")
            .visibility("visible")
        )
    )
    .and(StyleRule("[data-layout=horizontal]")
        .gridTemplateColumns("auto auto 1fr auto")
        .gridTemplateRows("auto auto")
        .child(StyleRule("label.label")
            .gridRowStart("2")
            .marginRight(5)
            .marginBottom(5)
        )
        .child(StyleRule("[data-content=content]")
            .gridRowStart("2")
            .gridColumnStart("3")
            .marginTop(0)
            .marginBottom(5)
        )
        .child(StyleRule("i[data-help=help]")
            .gridRowStart("2")
            .gridColumnStart("4")
        )
        .child(StyleRule(".field-error")
            .gridRowStart("4")
            .gridColumnStart("1")
            .gridColumnEnd("span 3")
        )
        .child(StyleRule("span[data-required=required]")
            .gridRowStart("2")
            .gridColumnStart("2")
            .marginRight(5)
            .display("none")
            .color(Colors.red)
            .and(StyleRule(".true")
                .display("inline")
            )
        )
    )
, "div[data-wa-form-field=wa-form-field]");

CSS(StyleRule()
    .width(300)
    .maxHeight(500)
    .overflow("auto")
    .padding(10)
    .verticalFlexLayout({ alignItems: "center", justifyContent: "flex-start"})
, "div[data-form-field-help=help-window]");

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

    return <div
        data-wa-form-field="wa-form-field"
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
