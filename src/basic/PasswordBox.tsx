import XNode from "@web-atoms/core/dist/core/XNode";
import IElement from "./IElement";

import "./styles/password-box-style";

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
