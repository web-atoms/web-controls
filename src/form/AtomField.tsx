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

class AtomFieldControl extends AtomControl {

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

    @BindableProperty
    public content: any;

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

    public onPropertyChanged(name: keyof AtomFieldControl): void {
        switch (name) {
            case "error":
                AtomBinder.refreshValue(this, "hasError");
                break;
            case "helpLink":
            case "helpText":
                AtomBinder.refreshValue(this, "hasHelp");
                break;
            case "content":
                if (!this.contentPresenter) {
                    setTimeout(() => this.onPropertyChanged(name), 100);
                    return;
                }
                this.removeAllChildren(this.contentPresenter);
                const e = this.content?.element ?? this.content as HTMLElement;
                if (!e) {
                    return;
                }
                if (typeof e === "string") {
                    this.contentPresenter.appendChild(document.createTextNode(e));
                    return;
                }
                this.contentPresenter.appendChild(e);
                const input = e.tagName === "INPUT" ? e : e.getElementsByTagName("input")[0];
                if (input) {
                    if (!input.id) {
                        input.id = `__ID__formElementInput${inputID++}`;
                    }
                    this.htmlFor = input.id;
                }
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
        this.contentPresenter = null;
        this.render(<div
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
			<div presenter={Bind.presenter("contentPresenter")}
				class="presenter"></div>
			<span
				class="error"
				styleDisplay={Bind.oneWay(() => this.error ? "" : "none")}
				text={Bind.oneWay(() => this.error)}></span>
		</div>);

        if (this.content) {
            this.onPropertyChanged("content");
        }
    }

}

export interface IFieldAttributes {
    label?;
    error?;
    helpText?;
    helpLink?;
    helpIcon?;
    required?;
    visible?;
    fieldClass?;
    baseClass?: IClassOf<AtomFieldControl>;
}

export default function AtomField({
    label,
    error,
    helpText,
    helpLink,
    helpIcon,
    required,
    visible = true,
    fieldClass = null,
    baseClass: controlClass = AtomFieldControl
}: IFieldAttributes,              child: XNode) {
    const ControlClass = controlClass;
    return <ControlClass
        label={label}
        error={error}
        helpIcon={helpIcon}
        helpLink={helpLink}
        helpText={helpText}
        required={required}
        visible={visible}
        fieldClass={fieldClass}
        content={child}
        />;
}