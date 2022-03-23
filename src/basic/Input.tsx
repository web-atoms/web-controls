import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

const css = CSS(
    StyleRule("input")
    .display("inline-block")
    .child(
        StyleRule("input[type=input]")
        .margin(0)
        .padding(5)
        .height(25)
        .marginRight(5)
        .outline("none")
        .alignSelf("center")
    )
);

export default function Input({
    value,
    placeholder
}:{
    value:string,
    placeholder: string
}){
    return <div class={css}>
           <input type="input"
           placeholder={placeholder} />
    </div>;
}