import Bind from "@web-atoms/core/dist/core/Bind";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

export interface IFormField {
    label: string;
    required?: boolean;
    error?: string;
    class?: string;
    [key: string]: any;
}

const css = CSS(StyleRule()
    .verticalFlexLayout({ alignItems: "stretch"})
    .child(StyleRule(".field-error")
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
    .child(StyleRule(".label")
        .child(StyleRule(".true")
            .visibility("visible")
            .color(Colors.red)
        )
        .child(StyleRule(".required")
            .visibility("hidden")
        )
    )
, "div[data-wa-form-field=wa-form-field]");

export default function FormField(
    {
        label,
        required,
        error,
        ... others
    }: IFormField,
    node: XNode) {
    return <div data-wa-form-field="wa-form-field" { ... others }>
        <div class="label">
            <label text={label}/>
            <span class="required" styleClass={required} text="*" />
        </div>
        { node }
        <div class="field-error" text={error}/>
    </div>;
}
