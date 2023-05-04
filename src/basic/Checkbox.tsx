import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

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
