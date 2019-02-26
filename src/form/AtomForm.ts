import { AtomBinder } from "web-atoms-core/dist/core/AtomBinder";
import { BindableProperty } from "web-atoms-core/dist/core/BindableProperty";
import { IClassOf } from "web-atoms-core/dist/core/types";
import { AtomControl } from "web-atoms-core/dist/web/controls/AtomControl";
import AtomField from "./AtomField";
import AtomFieldTemplate from "./AtomFieldTemplate";
import AtomFormStyle from "./AtomFormStyle";
import DefaultFieldTemplate from "./DefaultFieldTemplate";

export default class AtomForm extends AtomControl {

    public fieldTemplate: IClassOf<AtomFieldTemplate>;

    public append(e: AtomControl | HTMLElement | Text): AtomControl {

        if (!(e instanceof AtomField)) {
            throw new Error(`Only AtomField can be added inside AtomForm`);
        }
        const fieldContainer = this.createField(e);
        return super.append(fieldContainer);
    }

    protected createField(e: AtomField): AtomFieldTemplate {
        const field = new (this.fieldTemplate)(this.app);
        field.field = e;
        this.app.callLater(() => {
            AtomBinder.refreshValue(e, "viewModel");
            AtomBinder.refreshValue(e, "localViewModel");
        });
        return field;
    }

    protected preCreate(): void {
        super.preCreate();
        this.defaultControlStyle = AtomFormStyle;
        this.fieldTemplate = DefaultFieldTemplate;
        this.runAfterInit(() => {
            this.element.classList.add(this.controlStyle.root.className);
        });
    }
}
