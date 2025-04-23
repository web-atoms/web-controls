import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomButtonBar from "../../button-bar/AtomButtonBar";

const genders = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" }
];

@Pack
export default class ButtonBarTest extends AtomControl {

    protected create(): void {
        this.render(<div>
            <AtomButtonBar
                items={genders}
                />
        </div>);
    }

}
