import Bind from "@web-atoms/core/dist/core/Bind.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import Switch from "../../../basic/Switch.js";

@Pack
export default class SwitchTest extends AtomControl {

    public ok: boolean;

    protected create(): void {
        this.ok = false;
        this.render(<div>
            <Switch
                checked={Bind.twoWays(() => this.ok)}/>
        </div>);
    }

}
