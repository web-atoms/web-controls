import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import TitleEditor from "../../../basic/TitleEditor";
import Pack from "@web-atoms/core/dist/Pack";

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
