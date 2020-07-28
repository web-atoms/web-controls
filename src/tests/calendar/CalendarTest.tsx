import Bind from "@web-atoms/core/dist/core/Bind";
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";

// @web-atoms-pack: true

import AtomCalendar from "../../calendar/AtomCalendar";

export default class CalendarTest extends AtomControl {

	constructor(app: any, e?: any) {
		super(app, e || document.createElement("div"));
	}

	public create(): void {

		this.render(
		<div>
			<AtomCalendar>
			</AtomCalendar>
		</div>
		);
	}
}
