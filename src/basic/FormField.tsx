import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

export interface IFormField {
    label: string;
    required?: boolean;
    error?: string;
}

const css = CSS(StyleRule()
    .child(StyleRule(".error")
        .padding(5)
        .backgroundColor(Colors.red)
        .color(Colors.white)
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
);

export default function FormField(
    {
        label,
        required,
        error
    }: IFormField,
    node: XNode) {
    return <div class={css}>
        <div class="label">
            <label text={label}/>
            <span class="required" styleClass={required} text="*" />
        </div>
        { node }
        <div class="error" text={error}/>
    </div>;
}
