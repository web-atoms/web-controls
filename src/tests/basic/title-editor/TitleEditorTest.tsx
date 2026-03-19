import XNode from "@web-atoms/core/dist/core/XNode.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import TitleEditor from "../../../basic/TitleEditor.js";
import Pack from "@web-atoms/core/dist/Pack.js";

@Pack
export default class TitleEditorTest extends AtomControl {

    protected create(): void {
        this.render(<div>
            <TitleEditor
                capitalize="on"
                value=""
                />
        </div>);
    }

}
