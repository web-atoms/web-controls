import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

CSS(StyleRule()
    .flexLayout({ alignItems: "center" , justifyContent: "flex-start" })
    .child(StyleRule("*")
        .flex("0 0 auto")
    )
, "div[data-row=row]");

CSS(StyleRule()
    .backgroundColor(Colors.purple.withAlphaPercent(0.1))
    .borderRadius(9999)
    .padding(7)
    .nested(StyleRule("*[data-fa-button=fa-button]")
        .child(StyleRule("label")
            .child(StyleRule(".fad")
                .color(Colors.white)
            )
        )
    )
    .nested(StyleRule("button")
        .backgroundColor(Colors.purple)
        .color(Colors.white)
        .hover(StyleRule()
            .backgroundColor(Colors.green)
        )
    )
, "div[data-command-row=command-row]");

export default function Row(a: any, ... nodes: XNode[]) {
    return <div data-row="row" { ... a}>
        { ... nodes }
    </div>;
}

Row.stretch = { "style-flex": "1 1 100%" };

export function CommandRow(a: any, ... nodes: XNode[]) {
    return <div
        data-row="row"
        data-command-row="command-row" { ... a}>
        { ... nodes }
    </div>;
}

CommandRow.stretch = Row.stretch;
