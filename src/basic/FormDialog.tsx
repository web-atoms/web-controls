import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import Form, { IForm } from "./Form";

CSS(StyleRule()
    .display("flex")
    .overflow("auto")
    .position("relative")
    .child(StyleRule("[data-wa-form]")
        .marginBottom(70)
        .child(StyleRule("[data-command-row]")
            .absolutePosition({
                left: 0,
                right: 0,
                bottom: 0
            })
        )
    )
, "div[data-form-dialog=true]");

export default function FormDialog(a: IForm, ... nodes: XNode[]) {
    return <div data-form-dialog="true">
        <Form scrollable={true} {... a}>
            { ... nodes}
        </Form>
    </div>;
}