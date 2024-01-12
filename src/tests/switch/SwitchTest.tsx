import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import Switch from "../../basic/Switch";

export default class SwitchTest extends AtomControl {

    public ready: boolean;

    public create() {

        this.ready = false;

        this.render(<div>
            <Switch
                checked={Bind.twoWays(() => this.ready)}
                />
            <span text={Bind.oneWay(() => this.ready ? "On" : "Off")}/>
        </div>);
    }

}
