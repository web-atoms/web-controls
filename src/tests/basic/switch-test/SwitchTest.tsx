import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import Switch from "../../../basic/Switch";

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
