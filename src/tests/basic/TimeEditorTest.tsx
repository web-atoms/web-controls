import Pack from "@web-atoms/core/dist/Pack";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import TimeEditor from "../../basic/TimeEditor";

@Pack
export default class TimeEditorTest extends AtomControl {

    protected create(): void {
        this.render(<div>
            <TimeEditor/>
        </div>);
    }

}
