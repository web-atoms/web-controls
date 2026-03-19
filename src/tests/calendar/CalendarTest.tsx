import Bind from "@web-atoms/core/dist/core/Bind.js";
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl.js";

// @web-atoms-pack: true

import AtomCalendar from "../../calendar/AtomCalendar.js";

export default class CalendarTest extends AtomControl {

	public create(): void {

		this.render(
		<div>
			<AtomCalendar>
			</AtomCalendar>
		</div>
		);
	}
}
