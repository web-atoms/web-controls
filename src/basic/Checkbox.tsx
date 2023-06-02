import XNode from "@web-atoms/core/dist/core/XNode";

import "./styles/checkbox-style";

export default function Checkbox({
    checked,
    text
}: {
    checked: any,
    text: string
}) {
    return <div data-check-box="check-box">
        <label>
            <input
                type="checkbox"
                checked={checked}/>
            <span
                text={text}></span>
        </label>
    </div>;
}
