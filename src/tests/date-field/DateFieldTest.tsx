// tslint:disable
import Bind from "@web-atoms/core/dist/core/Bind"
import XNode from "@web-atoms/core/dist/core/XNode"
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty.js";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl.js";

    import AtomDateField from "../../date-field/AtomDateField.js";


export default class DateFieldTest extends AtomControl {
	
	public create(): void {
		
		this.render(
		<div>
			<AtomDateField>
			</AtomDateField>
		</div>
		);
	}
}
