import XNode from "@web-atoms/core/dist/core/XNode";
import IElement from "./IElement";

import "./styles/switch-style";

/**
 * Original source = https://www.htmllion.com/css3-toggle-switch-button.html
 */


export interface ISwitch extends IElement {
	checked;
	onLabel?: string;
	offLabel?: string;
}

export default function Switch({
	checked,
	onLabel,
	offLabel,
	... a
}: ISwitch) {

    return <label data-ui-switch="ui-switch" { ... a} >
	    <input class="switch-input" type="checkbox" checked={checked} />
	    <span class="switch-label" data-on={onLabel ?? "On"} data-off={offLabel ?? "Off"}></span>
	    <span class="switch-handle"></span>
    </label>;
}
