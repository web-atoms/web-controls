import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CheckBoxList from "../../basic/CheckBoxList";

@Pack
export default class CheckBoxListSample extends AtomControl {

    protected create(): void {
        this.render(<div>
            <CheckBoxList
                items={["A", "B", "C"]}
                selectedItems={["B"]}
                />
        </div>)
    }

}
