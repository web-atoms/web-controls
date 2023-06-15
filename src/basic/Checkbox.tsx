import XNode from "@web-atoms/core/dist/core/XNode";

import "./styles/checkbox-style";
import IElement from "./IElement";

export interface ICheckbox extends IElement {
    checked: any;
    text: string;
}

export default function Checkbox({
    checked,
    text,
    ... a
}: ICheckbox) {
    return <div data-check-box="check-box" { ... a}>
        <label>
            <input
                type="checkbox"
                checked={checked}/>
            <span
                text={text}></span>
        </label>
    </div>;
}
