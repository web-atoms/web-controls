import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomField from "./AtomField";

export default class AtomFieldTemplate extends AtomControl {

    public static labelIDs: number = 1;

    public contentPresenter: HTMLElement;

    public labelPresenter: HTMLElement;

    public field: AtomField;

    protected preCreate(): void {
        super.preCreate();
        this.contentPresenter = null;
        this.labelPresenter = null;
        this.runAfterInit(() => {
            this.contentPresenter.appendChild(this.field.element);

            const input = this.field.element.getElementsByTagName("input")[0] as HTMLInputElement;
            if (input) {
                const label = (this.labelPresenter as HTMLLabelElement);
                input.id = input.id || (input.id = `__id__${AtomFieldTemplate.labelIDs++}`);
                label.htmlFor = input.id;
            }

        });
    }

}
