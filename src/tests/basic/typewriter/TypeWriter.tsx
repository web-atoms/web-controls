import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import TypeWriter from "../../../basic/TypeWriter.js";


@Pack
export default class TypeWriterTest extends AtomControl {

    protected create(): void {
        this.render(<div style-width="100px" style-height="500px">
            <TypeWriter text="Professional Actor, Dancer, Singer"/>
        </div>);
    }

}
