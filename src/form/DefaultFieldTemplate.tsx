import Bind from "@web-atoms/core/dist/core/xnode/Bind";
import XNode from "@web-atoms/core/dist/core/xnode/XNode";
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
				class="label"/>
		</div>);
	}
}
