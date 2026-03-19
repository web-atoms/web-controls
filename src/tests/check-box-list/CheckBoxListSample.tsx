import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import CheckBoxList from "../../basic/CheckBoxList.js";

const pair = (... x) => x.map((l) => ({
    label: l,
    value: l
}));

const items = pair("A", "B", "C");

@Pack
export default class CheckBoxListSample extends AtomControl {

    protected create(): void {
        this.render(<div>
            <CheckBoxList
                softDeleteProperty="$deleted"
                items={items}
                labelPath={(i) => i.label}
                selectedItems={[items[1]]}
                />
        </div>)
    }

}
