import XNode from "@web-atoms/core/dist/core/XNode.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import PopupButton, { MenuItem } from "../../basic/PopupButton.js";

export default class PopupTest extends AtomControl {

    protected create(): void {
        this.render(<div>
            <PopupButton icon="fad fa-plus">
                <MenuItem
                    label="Add a"
                    eventClick={() => alert("a")}/>
            </PopupButton>
        </div>);
    }

}
