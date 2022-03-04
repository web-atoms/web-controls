import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import Calendar from "../../../basic/Calendar";

@Pack
export default class BasicCalendarTest extends AtomControl {

    protected create(): void {
        this.render(<div>
            <Calendar/>
        </div>);
    }

}
