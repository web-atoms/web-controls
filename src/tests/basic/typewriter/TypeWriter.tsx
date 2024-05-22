import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomRepeater from "../../../basic/AtomRepeater";
import Tooltip from "../../../basic/Tooltip";
import TypeWriter from "../../../basic/TypeWriter";


@Pack
export default class TypeWriterTest extends AtomControl {

    protected create(): void {
        this.render(<div style-width="100px" style-height="500px">
            <TypeWriter text="Professional Actor, Dancer, Singer"/>
        </div>);
    }

}
