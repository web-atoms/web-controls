import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

const css = CSS(
    StyleRule("check-box")
    .display("inline-block")
    .child(
        StyleRule("label")
        .display("flex")
        .paddingLeft(5)
        .paddingRight(5)
        .child(

            StyleRule("input[type=checkbox]")
            .borderRadius(3)
            .margin(0)
            .padding(0)
            .alignSelf("center")
        )
        .child(
            StyleRule("span")
            .alignSelf("center")
            .whiteSpace("nowrap")
            .marginLeft(5)
            .flexStretch()

        ))
);

export default function Checkbox({
    checked,
    text
}: {
    checked: any,
    text: string
}) {
    return <div class={css}>
        <label>
            <input
                type="checkbox"
                checked={checked}/>
            <span
                text={text}></span>
        </label>
    </div>;
}
