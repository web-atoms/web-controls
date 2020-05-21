// tslint:disable
import Bind from "@web-atoms/core/dist/core/Bind"
import XNode from "@web-atoms/core/dist/core/XNode"
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";

    import AtomPopupButton from "../buttons/AtomPopupButton";

    import AtomCalendar from "../calendar/AtomCalendar";

    import SRCalendar from "../calendar/res/SRCalendar";



export default class AtomDateField extends AtomPopupButton {

	public static itemTemplate = XNode.prepare("itemTemplate", true, true);
	
	protected srCalendar: SRCalendar;

	public selectedDate: Date ;

	public yearStart: any ;

	public yearEnd: any ;

	public enableFunc: any ;

	public currentMonth: any ;

	public itemTemplate: any ;

	public create(): void {
		
		this.srCalendar = this.app.resolve(SRCalendar);

		this.selectedDate = null;
		this.yearStart = -10;
		this.yearEnd = 10;
		this.enableFunc = null;
		this.render(
		<div
			text={Bind.oneWay(() => this.selectedDate ? this.srCalendar.toShortDate(this.selectedDate) : 'Select Date')}
			eventResult={Bind.event((s, e) => this.selectedDate = e.detail)}>
			<AtomPopupButton.page>
				<AtomCalendar
					selectedDate={Bind.twoWays(() => this.selectedDate)}
					yearStart={Bind.oneWay(() => this.yearStart)}
					yearEnd={Bind.oneWay(() => this.yearEnd)}
					enableFunc={Bind.oneWay(() => this.enableFunc)}
					itemTemplate={Bind.oneWay(() => this.itemTemplate)}
					eventDateClicked={Bind.event((s, e) => s.viewModel.close(e.detail.value))}>
				</AtomCalendar>
			</AtomPopupButton.page>
		</div>
		);
	}

	public preCreate() {
		this.selectedDate = null;
		this.yearStart = null;
		this.yearEnd = null;
		this.enableFunc = null;
		this.currentMonth = null;
		this.itemTemplate = null;
	}
}
