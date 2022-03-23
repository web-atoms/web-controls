import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import PopupButton, { MenuItem } from "../../basic/PopupButton";

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
