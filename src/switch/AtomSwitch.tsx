import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomSwitchStyle from "./AtomSwitchStyle";

export default class AtomSwitch extends AtomControl {

    @BindableProperty
    public value: boolean;

    constructor(app, e) {
        super(app, e || document.createElement("label"));
    }

    public create() {
        this.defaultControlStyle = AtomSwitchStyle;
        this.render(<label class={Bind.oneTime(() => this.controlStyle.name + " switch")}>
            <input type="checkbox" checked={Bind.twoWays(() => this.value)}/>
            <span class="slider"></span>
        </label>);
    }

}
