import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomFormStyle from "./AtomFormStyle";
import { refreshInherited } from "@web-atoms/core/dist/core/Hacks";

export default class AtomForm extends AtomControl {

    /** Submit event fired when enter was pressed on last input on mobile (Done button event) */
    public eventSubmit: () => void;

    public focusNextOnEnter: boolean = /mobile/i.test(navigator.userAgent);

    // public append(e: AtomControl | HTMLElement | Text): AtomControl {

    //     // you can create nested AtomForm
    //     if (e instanceof AtomForm) {
    //         return super.append(e);
    //     }

    //     if (!(e instanceof AtomField)) {
    //         throw new Error(`Only AtomField or AtomFormGroup can be added inside AtomForm`);
    //     }
    //     const fieldContainer = this.createField(e);
    //     return super.append(fieldContainer);
    // }

    // protected createField(e: AtomField): AtomFieldTemplate {
    //     const field = new (this.fieldTemplate)(this.app);
    //     field.field = e;
    //     return field;
    // }

    protected preCreate(): void {
        super.preCreate();
        this.defaultControlStyle = AtomFormStyle;
        this.runAfterInit(() => {

            this.element.classList.add(this.controlStyle.name);

            this.app.callLater(() => {
                refreshInherited(this, "viewModel");
                refreshInherited(this, "localViewModel");
                refreshInherited(this, "data");
            });

            this.watchKeyInput();
        });
    }

    protected watchKeyInput(): void {
        this.bindEvent(this.element, "keypress", (e) => {
            this.onKeyPress(e as any);
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
                this.fireSubmitEvent(input);
                return;
            }

            const next = this.focusNextInput(target);
            if (next) {
                next.focus();
            } else {
                this.fireSubmitEvent(input);
            }
        }
    }

    protected fireSubmitEvent(target: HTMLInputElement): void {

        // fire change event...
        target.dispatchEvent(new Event("change"));

        this.app.callLater(() => {
            const e = new CustomEvent("submit", { bubbles: false, cancelable: false });
            this.element.dispatchEvent(e);
        });
    }

    private focusNextInput(target: Element): HTMLInputElement | HTMLTextAreaElement {
        let found = false;
        let result: HTMLInputElement | HTMLTextAreaElement = null;
        function find(e: Element): HTMLInputElement | HTMLTextAreaElement {
            if (result) {
                return;
            }
            const isText = /input|textarea/i.test(e.tagName);
            if (found) {
                if (isText) {
                    result = e as any;
                    return;
                }
            }

            if (e === target) {
                found = true;
            }

            const child = e.firstElementChild;
            if (child) {
                find(child);
            }
            const next = e.nextElementSibling;
            if (next) {
                find(next);
            }
        }
        find(document.body);
        return result;
    }
}
