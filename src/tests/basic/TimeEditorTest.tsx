import Pack from "@web-atoms/core/dist/Pack.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import TimeEditor from "../../basic/TimeEditor.js";

@Pack
export default class TimeEditorTest extends AtomControl {

    protected create(): void {
        this.render(<div>
            <TimeEditor/>
        </div>);
    }

}
