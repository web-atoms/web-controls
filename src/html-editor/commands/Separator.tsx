import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

const separatorCss = CSS(StyleRule()
    .backgroundColor(Colors.darkGray)
    .marginLeft(4)
    .marginRight(4)
    .display("inline-block")
    .marginTop(4)
    .height(20)
    .width(2)
);

export default function Separator() {
    return <div class={separatorCss}></div>;
}
