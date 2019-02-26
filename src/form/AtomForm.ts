import { AtomBinder } from "web-atoms-core/dist/core/AtomBinder";
import { BindableProperty } from "web-atoms-core/dist/core/BindableProperty";
import { IClassOf } from "web-atoms-core/dist/core/types";
import { AtomControl } from "web-atoms-core/dist/web/controls/AtomControl";
import AtomField from "./AtomField";
import AtomFieldTemplate from "./AtomFieldTemplate";
import AtomFormStyle from "./AtomFormStyle";
import DefaultFieldTemplate from "./DefaultFieldTemplate";

export default class AtomForm extends AtomControl {

    @BindableProperty
    public fieldTemplate: IClassOf<AtomFieldTemplate>;

    public fields: AtomFieldTemplate[] = [];

    public append(e: AtomControl | HTMLElement | Text): AtomControl {

        if (!(e instanceof AtomField)) {
            throw new Error(`Only AtomField can be added inside AtomForm`);
        }
        const fieldContainer = this.createField(e);
        this.fields.push(fieldContainer);
        return super.append(fieldContainer);
    }

    public onPropertyChanged(name: keyof AtomForm): void {
        switch (name) {
            case "fieldTemplate":
            if (this.fields.length) {
                this.rebuild();
            }
            break;
        }
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

    protected rebuild(): void {
        const f = this.fields.map((x) => x);
        for (let i = 0; i < f.length ; i ++) {
            const iterator = f[i];
            iterator.field.element.remove();
            iterator.field = null;
            iterator.dispose();
            iterator.element.remove();
            const fc = this.createField(iterator.field);
            this.fields[i] = fc;
        }
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
