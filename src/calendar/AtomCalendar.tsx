// tslint:disable
import Bind from "@web-atoms/core/dist/core/Bind"
import XNode from "@web-atoms/core/dist/core/XNode"
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import {AtomComboBox} from "@web-atoms/core/dist/web/controls/AtomComboBox";
import {AtomItemsControl} from "@web-atoms/core/dist/web/controls/AtomItemsControl";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";

    import CalendarViewModel from "./CalendarViewModel";
    import AtomCalendarStyle from "./AtomCalendarStyle";
    import SRCalendar from "./res/SRCalendar";


export default class AtomCalendar extends AtomControl {	
	constructor(app: any, e?: any) {		super(app, e || document.createElement("div"));	}

	protected srCalendar: SRCalendar;

	@BindableProperty
	public selectedDate: Date ;

	@BindableProperty
	public yearStart: any ;

	@BindableProperty
	public yearEnd: any ;

	@BindableProperty
	public enableFunc: any ;

	@BindableProperty
	public currentDate: any ;

	@BindableProperty
	public itemTemplate: any ;

	public create(): void {		
		this.srCalendar = this.app.resolve(SRCalendar);
		this.localViewModel =  this.resolve(CalendarViewModel, 'owner') ;
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
					eventClick={Bind.event((x)=> (x.localViewModel).changeMonth(-1))}
					class="fas fa-caret-left"
					title="Previous Month"
					style="margin-right: 15px; font-size: 120%; cursor: pointer; padding:0 10px 0 10px;">				</i>
				<AtomComboBox
					valuePath="value"
					value={Bind.twoWays((x) => x.localViewModel.year)}
					items={Bind.oneWay((x) => x.localViewModel.yearList)}
					for="select">
					<AtomComboBox.itemTemplate>
						<option
							text={Bind.oneTime((x) => x.data.label)}>						</option>					</AtomComboBox.itemTemplate>				</AtomComboBox>
				<AtomComboBox
					valuePath="value"
					value={Bind.twoWays((x) => x.localViewModel.month)}
					items={Bind.oneTime(() => this.srCalendar.monthList)}
					for="select">
					<AtomComboBox.itemTemplate>
						<option
							text={Bind.oneTime((x) => x.data.label)}>						</option>					</AtomComboBox.itemTemplate>				</AtomComboBox>
				<i
					eventClick={Bind.event((x)=> (x.localViewModel).changeMonth(1))}
					class="fas fa-caret-right"
					title="Next Month"
					style="margin-left: 15px; font-size: 120%; cursor: pointer; padding:0 10px 0 10px;">				</i>			</div>
			<AtomItemsControl
				items={Bind.oneTime(() => this.srCalendar.weekDays)}
				class="week-days"
				for="div">			</AtomItemsControl>
			<AtomItemsControl
				class="month-days"
				itemTemplate={Bind.oneWay(() => this.itemTemplate)}
				items={Bind.oneWay((x) => x.localViewModel.items)}
				for="div">			</AtomItemsControl>
			<div
				template="itemTemplate"
				eventClick={Bind.event((x)=> (x.localViewModel).dateClicked((x.data)))}>
				<div
					text={Bind.oneTime((x) => x.data.label)}
					class={Bind.oneWay((x) => ({
                'date-css': 1,
                'is-other-month': x.data.isOtherMonth,
                'is-today': x.data.isToday,
                'is-weekend': x.data.isWeekend,
                'is-selected': x.localViewModel.selectedDate == x.data.value,
                'is-disabled': x.localViewModel.enableFunc ? x.localViewModel.enableFunc(x.data) : 0
            }))}>				</div>			</div>		</div>
		);	}}
