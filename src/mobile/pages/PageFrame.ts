import { AtomControl } from "web-atoms-core/dist/web/controls/AtomControl";
import { AtomFrame } from "web-atoms-core/dist/web/controls/AtomFrame";

export default class PageFrame extends AtomFrame {

    public push(ctrl: AtomControl): void {
        (ctrl as any).title = null;
        super.push(ctrl);
    }

    public clearStack(): void {
        for (const iterator of this.stack) {
            const e = iterator.element;
            iterator.dispose();
            e.remove();
        }
        this.stack.length = 0;
    }

}
