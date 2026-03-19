import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import { ExpanderMenu } from "../../../basic/Expander.js";

@Pack
export default class ExpanderMenuTest extends AtomControl {

    protected create(): void {
        this.render(<div>
            <ExpanderMenu
                style-width="100px"
                icon="fas fa-plus"
                isExpanded={false}
                >
                <span text="Parent"/>
                <div text="Line 1" data-selected={true}/>
                <div text="Line 2"/>
                <div text="Line 3"/>
                <div text="Line 4"/>
            </ExpanderMenu>
        </div>);
    }

}
