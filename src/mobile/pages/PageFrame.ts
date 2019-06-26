import { AtomControl } from "web-atoms-core/dist/web/controls/AtomControl";
import { AtomFrame } from "web-atoms-core/dist/web/controls/AtomFrame";

export default class PageFrame extends AtomFrame {

    public push(ctrl: AtomControl): void {
        (ctrl as any).title = null;
        super.push(ctrl);
    }
}
