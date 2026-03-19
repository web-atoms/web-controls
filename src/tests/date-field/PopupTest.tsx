// tslint:disable
import Bind from "@web-atoms/core/dist/core/Bind"
import XNode from "@web-atoms/core/dist/core/XNode"
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty.js";
import {AtomPageLink} from "@web-atoms/core/dist/web/controls/AtomPageLink.js";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl.js";

    import AtomDateField from "../../date-field/AtomDateField.js";



export default class PopupTest extends AtomControl {
	
	public create(): void {
		
		this.render(
		<div>
			<AtomPageLink
				text="Add New"
				for="button">
				<AtomPageLink.page>
					<div>
						<div>Select Date</div>
						<AtomDateField/>
					</div>
				</AtomPageLink.page>
			</AtomPageLink>
		</div>
		);
	}
}
