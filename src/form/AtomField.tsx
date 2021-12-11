import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import { IClassOf } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import { AtomContentControl } from "@web-atoms/core/dist/web/controls/AtomContentControl";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
export { default as HP } from "./HelpPopup";

let inputID = 0;

export default class AtomField extends AtomControl {

    @BindableProperty
    public icon: string;

    @BindableProperty
    public label: string;

    @BindableProperty
    public error: string;

    @BindableProperty
    public helpText: string;

    @BindableProperty
    public helpLink: string;

    @BindableProperty
    public helpIcon: string;

    @BindableProperty
    public required: boolean;

    @BindableProperty
    public visible: boolean;

    @BindableProperty
    public fieldClass: string;

    public get hasError(): boolean {
        return this.error ? true : false;
    }

    public get hasHelp(): boolean {
        return (this.helpText || this.helpLink) ? true : false;
    }

    @BindableProperty
    protected contentPresenter: any;

    @BindableProperty
    protected htmlFor: any;

    public onPropertyChanged(name: keyof AtomField): void {
        switch (name) {
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

    protected render(node: XNode, e?: any, creator?: any): void {
        // following line will prevent stack overflow
        this.render = super.render;
        super.render(<div
            { ... node.attributes}
			class={Bind.oneWay(() => ({
				"form-field": 1,
				[this.fieldClass]: this.fieldClass,
				"has-error": this.error,
				"field-hidden": !this.visible
			}))}>
			<label
				class="label"
				text={Bind.oneWay(() => this.label)}
                htmlFor={Bind.oneWay(() => this.htmlFor)}/>
			<span
				class="required"
				styleVisibility={Bind.oneTime(() => this.required ? "visible" : "hidden")}>*</span>
			<div
				class="presenter">
                    {... node.children as any[]}
                </div>
			<span
				class="error"
				styleDisplay={Bind.oneWay(() => this.error ? "" : "none")}
				text={Bind.oneWay(() => this.error)}></span>
		</div>);

        const first = this.element.getElementsByTagName("input")[0];
        if (first) {
            if (!first.id) {
                first.id = `webAtomsFormFieldInputNumber${inputID++}`;
            }
            this.htmlFor = first.id;
        }
    }

}
