import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomFieldTemplate from "./AtomFieldTemplate";

export default class DefaultFieldTemplate extends AtomFieldTemplate {

	public create(): void {
		this.render(<div
			class={Bind.oneWay(() => ({
				"form-field": 1,
				[this.field.fieldClass]: this.field.fieldClass,
				"hasError": this.field.hasError,
				"field-hidden": !this.field.visible
			}))}>
			<label
				presenter={Bind.presenter("labelPresenter")}
				class="label"
				text={Bind.oneWay(() => this.field.label)}/>
			<span
				class="required"
				styleDisplay={Bind.oneTime(() => this.field.required ? "" : "none")}>*</span>
			<div presenter={Bind.presenter("contentPresenter")}
				class="presenter"></div>
			<span
				class="error"
				styleDisplay={Bind.oneWay(() => this.field.hasError ? "" : "none")}
				text={Bind.oneWay(() => this.field.error)}></span>
		</div>);
	}
}
