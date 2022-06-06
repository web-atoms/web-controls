import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import IElement from "./IElement";

CSS(StyleRule()
    .display("inline-grid")
    .gridTemplateColumns("1fr 20px")
    .child(StyleRule("input")
        .gridRowStart("1")
        .gridColumnStart("1")
        .gridColumnEnd("span 2")
        .and(StyleRule("::-ms-reveal")
            .display("none")
        )
    )
    .child(StyleRule("i")
        .gridRowStart("1")
        .gridColumnStart("2")
        .alignSelf("center")
        .justifySelf("center")
        .zIndex("2")
    )
, "div[data-password-box=password-box]");

document.body.addEventListener("togglePassword", (e) => {
    const current = e.target as HTMLElement;
    const input = current.previousElementSibling as HTMLInputElement;
    if (input?.tagName !== "INPUT") {
        return;
    }
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    current.className = !isPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash";
    current.title = !isPassword ? "Display Password" : "Hide Password";
});

export interface IPasswordBox extends IElement {
    value: any;
    placeholder?: any;
}

export default function PasswordBox({
    placeholder,
    value,
    ... a
}: IPasswordBox) {
    return <div
        data-password-box="password-box"
        { ... a}>
        <input
            placeholder={placeholder}
            type="password"
            value={value} />
        <i
            class="fa-solid fa-eye"
            title="Display Password"
            data-click-event="togglePassword"
            data-password-hint="password-hint" />
    </div>;
}
