import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
export { default as HP } from "./HelpPopup";

export default class AtomField extends AtomControl {

    @BindableProperty
    public label: string = null;

    @BindableProperty
    public error: string = null;

    @BindableProperty
    public helpText: string = null;

    @BindableProperty
    public helpLink: string = null;

    @BindableProperty
    public helpIcon: string = null;

    @BindableProperty
    public required: boolean = false;

    @BindableProperty
    public visible: boolean = true;

    @BindableProperty
    public fieldClass: string = "";

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

}
