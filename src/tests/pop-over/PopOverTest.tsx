import XNode from "@web-atoms/core/dist/core/XNode.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import InlinePopupButton from "../../basic/InlinePopupButton.js";
import { MenuItem } from "../../basic/PopupButton.js";
import PopupMenu from "../../basic/PopupMenu.js";

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
            <div style="position: relative">
                <br/>
                <br/>
                <br/>
                <br/>

                <PopupMenu
                    anchor-left="parent-right"
                    popup={() => <div>
                        <MenuItem label="As Inline"/>
                        <MenuItem label="As Attachment"/>
                        <MenuItem label="As Inline"/>
                        <MenuItem label="As Attachment"/>
                        <MenuItem label="As Inline"/>
                        <MenuItem label="As Attachment"/>
                        <MenuItem label="As Inline"/>
                        <MenuItem label="As Attachment"/>
                        <MenuItem label="As Inline"/>
                        <MenuItem label="As Attachment"/>
                        <MenuItem label="As Inline"/>
                        <MenuItem label="As Attachment"/>
                    </div>}
                    >Forward</PopupMenu>
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

            </div>
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
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

        </div>;
    }


}