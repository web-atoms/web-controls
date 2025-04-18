import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import InlinePopupButton from "../../basic/InlinePopupButton";
import { MenuItem } from "../../basic/PopupButton";
import PopupMenu from "../../basic/PopupMenu";

export default class PopOverTest extends AtomControl {

    constructor(app, e) {
        super(app,e);
        this.pushInit();
    }

    init() {
        this.renderer = <div>

            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

            <PopupMenu
                anchor-bottom="parent-top"
                popup={() => <div>
                    <MenuItem label="As Inline"/>
                    <MenuItem label="As Attachment"/>
                </div>}
                >Forward</PopupMenu>

        </div>;
    }


}