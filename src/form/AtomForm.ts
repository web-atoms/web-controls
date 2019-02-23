import { AtomBinder } from "web-atoms-core/dist/core/AtomBinder";
import { IClassOf } from "web-atoms-core/dist/core/types";
import { AtomControl } from "web-atoms-core/dist/web/controls/AtomControl";
import AtomField from "./AtomField";
import AtomFieldTemplate from "./AtomFieldTemplate";
import DefaultFieldTemplate from "./DefaultFieldTemplate";

export default class AtomForm extends AtomControl {

    public fieldTemplate: IClassOf<AtomFieldTemplate> = DefaultFieldTemplate;

    public children: AtomControl[] = [];

    public append(e: AtomControl | HTMLElement | Text): AtomControl {

        if (!(e instanceof AtomField)) {
            throw new Error(`Only AtomField can be added inside AtomForm`);
        }

        const fieldContainer = new (this.fieldTemplate)(this.app);
        fieldContainer.field = e as AtomField;
        this.app.callLater(() => {
            AtomBinder.refreshValue(e, "viewModel");
            AtomBinder.refreshValue(e, "localViewModel");
        });
        return super.append(fieldContainer);
    }
}
