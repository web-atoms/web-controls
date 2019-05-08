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

    public focusNextOnEnter: boolean = /mobile/i.test(navigator.userAgent);

    public eventSubmit: (e: any) => void = null;

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
        return field;
    }

    protected preCreate(): void {
        super.preCreate();
        this.defaultControlStyle = AtomFormStyle;
        this.fieldTemplate = DefaultFieldTemplate;
        this.runAfterInit(() => {
            this.element.classList.add(this.controlStyle.root.className);
            
            this.app.callLater(() => {
                this.refreshInherited("viewModel", (a) => a.mViewModel === undefined);
                this.refreshInherited("localViewModel", (a) => a.mLocalViewModel === undefined);
                this.refreshInherited("data", (a) => a.mData === undefined);
            });

            this.bindEvent(this.element, "keypress", (e) => {
                this.onKeyPress(e as any);
            });
        });
    }

    protected onKeyPress(e: KeyboardEvent): void {
        if (!this.focusNextOnEnter) {
            return;
        }
        const target = e.target as HTMLElement;
        if (!/input/i.test(target.tagName)) {
            return;
        }
        const input = target as HTMLInputElement;
        if (e.keyCode === 13) {
            if (/submit/i.test(input.className)) {
                if (this.eventSubmit) {
                    this.eventSubmit(e);
                    return;
                }
            }

            this.focusNextInput(target);
        }
    }

    private focusNextInput(target: Element) {
        const elements = document.getElementsByTagName("input");
        let last = null;
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            if (last === target) {
                element.focus();
                return;
            }
            last = element;
        }
    }
}
