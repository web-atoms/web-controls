import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import Calendar from "../../../basic/Calendar.js";

@Pack
export default class BasicCalendarTest extends AtomControl {

    protected create(): void {
        this.render(<div>
            <Calendar/>
        </div>);
    }

}
