import Bind from "@web-atoms/core/dist/core/Bind";
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import {AtomComboBox} from "@web-atoms/core/dist/web/controls/AtomComboBox";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";
import {AtomItemsControl} from "@web-atoms/core/dist/web/controls/AtomItemsControl";
import AtomCalendarStyle from "./AtomCalendarStyle";
import CalendarViewModel from "./CalendarViewModel";
import SRCalendar from "./res/SRCalendar";

const BindCalendar = Bind
	.forLocalViewModel<CalendarViewModel>();

export default class AtomCalendar extends AtomControl {

	public static itemTemplate = XNode.prepare("itemTemplate", true, true);

	public selectedDate: Date ;

	public yearStart: any ;

	public yearEnd: any ;

	public enableFunc: any ;

	public currentDate: any ;

	public itemTemplate: any ;

	public localViewModel: CalendarViewModel;

	protected srCalendar: SRCalendar;

	public create(): void {

		this.srCalendar = this.app.resolve(SRCalendar);
		this.localViewModel =  this.resolve(CalendarViewModel, "owner") ;
		this.defaultControlStyle = AtomCalendarStyle;

		this.selectedDate = null;
		this.yearStart = -10;
		this.yearEnd = 10;
		this.enableFunc = null;
		this.render(
		<AtomCalendar
			styleClass={Bind.oneWay(() => this.controlStyle.name)}>
			<AtomCalendar.itemTemplate>
				<div
					eventClick={BindCalendar.event((x) => x.localViewModel.dateClicked((x.data)))}>
					<div
						text={BindCalendar.oneTime((x) => x.data.label)}
						class={BindCalendar.oneWay((x) => ({
						"date-css": 1,
						"is-other-month": x.data.isOtherMonth,
						"is-today": x.data.isToday,
						"is-weekend": x.data.isWeekend,
						// tslint:disable-next-line: triple-equals
						"is-selected": x.localViewModel.selectedDate == x.data.value,
						"is-disabled": x.localViewModel.enableFunc ? 0 : x.localViewModel.enableFunc(x.data)
						}))}>
					</div>
				</div>
			</AtomCalendar.itemTemplate>
			<div
				class="header">
				<i
					eventClick={Bind.event(() => this.localViewModel.changeMonth(-1))}
					class="fas fa-caret-left"
					title="Previous Month"
					style="margin-right: 15px; font-size: 120%; cursor: pointer; padding:0 10px 0 10px;">
				</i>
				<AtomComboBox
					valuePath="value"
					value={Bind.twoWays(() => this.localViewModel.year)}
					items={Bind.oneWay(() => this.localViewModel.yearList)}
					for="select">
					<AtomComboBox.itemTemplate>
						<option
							text={Bind.oneTime((x) => x.data.label)}>
						</option>
					</AtomComboBox.itemTemplate>
				</AtomComboBox>
				<AtomComboBox
					valuePath="value"
					value={Bind.twoWays(() => this.localViewModel.month)}
					items={Bind.oneTime(() => this.srCalendar.monthList)}
					for="select">
					<AtomComboBox.itemTemplate>
						<option
							text={Bind.oneTime((x) => x.data.label)}>
						</option>
					</AtomComboBox.itemTemplate>
				</AtomComboBox>
				<i
					eventClick={Bind.event(() => this.localViewModel.changeMonth(1))}
					class="fas fa-caret-right"
					title="Next Month"
					style="margin-left: 15px; font-size: 120%; cursor: pointer; padding:0 10px 0 10px;">
				</i>
			</div>
			<AtomItemsControl
				items={Bind.oneTime(() => this.srCalendar.weekDays)}
				class="week-days"
				for="div">
			</AtomItemsControl>
			<AtomItemsControl
				class="month-days"
				itemTemplate={Bind.oneWay(() => this.itemTemplate)}
				items={Bind.oneWay(() => this.localViewModel.items)}
				for="div">
			</AtomItemsControl>
		</AtomCalendar>
		);
	}

	protected preCreate() {
		this.selectedDate = null;
		this.yearStart = null;
		this.yearStart = null;
		this.enableFunc = null;
		this.currentDate = null;
		this.itemTemplate = null;
	}
}
