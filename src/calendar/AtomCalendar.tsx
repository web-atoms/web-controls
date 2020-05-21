import Bind from "@web-atoms/core/dist/core/Bind";
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import {AtomComboBox} from "@web-atoms/core/dist/web/controls/AtomComboBox";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";
import {AtomItemsControl} from "@web-atoms/core/dist/web/controls/AtomItemsControl";
import AtomCalendarStyle from "./AtomCalendarStyle";
import CalendarViewModel from "./CalendarViewModel";
import SRCalendar from "./res/SRCalendar";

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
		<div
			styleClass={Bind.oneWay(() => this.controlStyle.root)}>
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
			<div
				template="itemTemplate"
				eventClick={Bind.event((x) => this.localViewModel.dateClicked((x.data)))}>
				<div
					text={Bind.oneTime((x) => x.data.label)}
					class={Bind.oneWay((x) => ({
                "date-css": 1,
                "is-other-month": x.data.isOtherMonth,
                "is-today": x.data.isToday,
                "is-weekend": x.data.isWeekend,
                // tslint:disable-next-line: triple-equals
                "is-selected": this.localViewModel.selectedDate == x.data.value,
                "is-disabled": this.localViewModel.enableFunc ? this.localViewModel.enableFunc(x.data) : 0
            }))}>
				</div>
			</div>
		</div>
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
