import Bind from "@web-atoms/core/dist/core/Bind.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import MaskedInput from "../../basic/MaskedInput.js";

@Pack
export default class MaskedInputTest extends AtomControl {

    public phone: string;

    protected create(): void {
        this.phone = "";
        this.render(<div>
            <MaskedInput
                mask="###.###.####"
                value={Bind.twoWaysImmediate(() => this.phone)}
                />
            <br/>
            <div text={Bind.oneWay(() => this.phone)}/>
        </div>);
    }

}
