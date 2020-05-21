import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
export { default as HP } from "./HelpPopup";

export default class AtomField extends AtomControl {

    public label: string;

    public error: string;

    public helpText: string;

    public helpLink: string;

    public helpIcon: string;

    public required: boolean;

    public visible: boolean;

    public fieldClass: string;

    public get hasError(): boolean {
        return this.error ? true : false;
    }

    public get hasHelp(): boolean {
        return (this.helpText || this.helpLink) ? true : false;
    }

    public onPropertyChanged(name: keyof AtomField): void {
        switch (name) {
            case "error":
                AtomBinder.refreshValue(this, "hasError");
                break;
            case "helpLink":
            case "helpText":
                AtomBinder.refreshValue(this, "hasHelp");
                break;
        }
    }

    public async openHelp(): Promise<void> {
        const n = this.app.resolve(NavigationService) as NavigationService;

        if (this.helpText) {
            await n.openPage("@web-atoms/web-controls/dist/form/HelpPopup", { message: this.helpText });
            return;
        }

        if (this.helpLink) {
            // if it is http, then open it inside iframe..
            // pending

            // else
            await n.openPage(this.helpLink);
        }
    }

    protected preCreate() {
        this.label = null;
        this.error = null;
        this.helpText = null;
        this.helpLink = null;
        this.helpIcon = null;
        this.required = false;
        this.visible = true;
        this.fieldClass = "";
    }

}
