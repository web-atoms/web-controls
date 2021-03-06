import Bind from "@web-atoms/core/dist/core/Bind";
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomPopupButton from "../buttons/AtomPopupButton";
import AtomCalendar from "../calendar/AtomCalendar";
import SRCalendar from "../calendar/res/SRCalendar";

const shortDate = {
	year: "numeric",
	month: "short",
	day: "numeric"
};

export default class AtomDateField extends AtomPopupButton {

	public static itemTemplate = XNode.prepare("itemTemplate", true, true);

	public selectedDate: Date ;

	public yearStart: any ;

	public yearEnd: any ;

	public enableFunc: any ;

	public currentMonth: any ;

	public itemTemplate: any ;

	public placeholder: string;

	public labelFunc: any;

	public locale: any;

	public localeOptions: any;

	protected srCalendar: SRCalendar;

	public create(): void {

		const srCalendar = this.app.resolve(SRCalendar);

		this.selectedDate = null;
		this.yearStart = -10;
		this.yearEnd = 10;
		this.enableFunc = null;
		this.labelFunc = null;
		this.locale = "en-US";
		this.localeOptions = shortDate;
		this.placeholder = "Select Date";
		this.render(
		<div
			text={Bind.oneWay(() => this.selectedDate
				? (this.labelFunc
					? this.labelFunc(this.selectedDate)
					: (this.selectedDate.toLocaleDateString
						? this.selectedDate.toLocaleDateString(this.locale, this.localeOptions)
						: srCalendar.toShortDate(this.selectedDate)))
				: this.placeholder)}
			eventResult={Bind.event((s, e) => this.selectedDate = e.detail)}>
			<AtomPopupButton.page>
				<AtomCalendar
					selectedDate={Bind.twoWays(() => this.selectedDate)}
					yearStart={Bind.oneWay(() => this.yearStart)}
					yearEnd={Bind.oneWay(() => this.yearEnd)}
					enableFunc={Bind.oneWay(() => this.enableFunc)}
					itemTemplate={Bind.oneWay(() => this.itemTemplate || undefined)}
					eventDateClicked={Bind.event((s, e) => s.viewModel.close(e.detail.value))}>
				</AtomCalendar>
			</AtomPopupButton.page>
		</div>
		);
	}

	public preCreate() {
		super.preCreate();
		this.selectedDate = null;
		this.yearStart = null;
		this.yearEnd = null;
		this.enableFunc = null;
		this.currentMonth = null;
		this.itemTemplate = null;
	}
}
