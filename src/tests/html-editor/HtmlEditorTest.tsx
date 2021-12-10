import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import HtmlEditor from "../../html-editor/HtmlEditor";

@Pack
export default class HtmlEditorTest extends AtomControl {

    protected create(): void {
        this.render(<div>
            <HtmlEditor/>
        </div>);
    }
}
