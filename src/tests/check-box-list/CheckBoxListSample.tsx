import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CheckBoxList from "../../basic/CheckBoxList";

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
