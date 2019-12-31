// tslint:disable
import Bind from "@web-atoms/core/dist/core/Bind"
import XNode from "@web-atoms/core/dist/core/XNode"
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import {AtomPageLink} from "@web-atoms/core/dist/web/controls/AtomPageLink";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";

    import AtomDateField from "../AtomDateField";


export default class PopupTest extends AtomControl {	
	constructor(app: any, e?: any) {		super(app, e || document.createElement("div"));	}

	public create(): void {		
		this.render(
		<div>
			<AtomPageLink
				text="Add New"
				for="button">
				<div
					template="page">
					<div>

						                Select Date
						            					</div>
					<AtomDateField>					</AtomDateField>				</div>			</AtomPageLink>		</div>
		);	}}
