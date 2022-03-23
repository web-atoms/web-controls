import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

export interface IPanelAttributes {
    header?: string;
    class?: string;
}

const css = CSS(StyleRule("panel")
    .display("inline-block")
    .padding(5)
    .margin(3)
    .borderRadius(9999)
    .defaultBoxShadow()
    .child(StyleRule(".header")
        .backgroundColor(Colors.lightGray)
        .borderRadius(5)
        .padding(5)
    ));

export default function Panel(
    {
        header,
        class: className
    }: IPanelAttributes,
    ... children: any[]) {

    className = className ? css + " " + className : css;

    if (header) {
        return <div class={className}>
            <label class="header">{header}</label>
            { ... children }
        </div>;
    }

    return <div class={className}>
        { ... children }
    </div>;

}
