// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomComboBox} from "web-atoms-core/dist/web/controls/AtomComboBox";
import {AtomItemsControl} from "web-atoms-core/dist/web/controls/AtomItemsControl";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
	
	    import CalendarViewModel from "./CalendarViewModel";
	    import AtomCalendarStyle from "./AtomCalendarStyle";
	    import SRCalendar from "./res/SRCalendar";
	
	
	export default class AtomCalendar extends AtomControl {
		
		protected srCalendar:  SRCalendar ;
		
		@BindableProperty
		public  selectedDate:  Date  ;
		
		@BindableProperty
		public  yearStart: any  ;
		
		@BindableProperty
		public  yearEnd:  any  ;
		
		@BindableProperty
		public  enableFunc:  any  ;
		
		@BindableProperty
		public  currentDate:  any ;
		
		@BindableProperty
		public  itemTemplate:  any ;
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("div"));
		}
		
		public create(): void {
			
			super.create();
			
			this.srCalendar = this.app.resolve( SRCalendar );
			
			this. selectedDate =  null;
			
			this. yearStart =  -10;
			
			this. yearEnd =  10;
			
			this. enableFunc =  null;
			
			const __creator = this;
			
			this.defaultControlStyle =  AtomCalendarStyle ;
			
			this.localViewModel =  this.resolve(CalendarViewModel, 'owner') ;
			
			this.bind(this.element, "styleClass",  [["this","controlStyle","root"]], false , null , __creator);
			
			this.itemTemplate = AtomCalendar_itemTemplate_3_3Creator(this);
			
			const e1 = document.createElement("div");
			
			this.append(e1);
			
			this.setPrimitiveValue(e1, "class", "header" );
			
			const e2 = document.createElement("i");
			
			e1.appendChild(e2);
			
			this.runAfterInit( () => this.setLocalValue(e2, "eventClick",  ()=> (this.localViewModel).changeMonth(-1)) );
			
			this.setPrimitiveValue(e2, "class", "fas fa-caret-left" );
			
			this.setPrimitiveValue(e2, "title", "Previous Month" );
			
			this.setPrimitiveValue(e2, "style", "margin-right: 15px; font-size: 120%; cursor: pointer; padding:0 10px 0 10px;" );
			
			const e3 = new AtomComboBox(this.app, document.createElement("select"));
			
			e3.setPrimitiveValue(e3.element, "valuePath", "value" );
			
			e3.bind(e3.element, "value",  [["localViewModel","year"]], true  );
			
			e3.bind(e3.element, "items",  [["localViewModel","yearList"]], false , null );
			
			e3.itemTemplate = AtomCalendar_itemTemplate_1_1Creator(this);
			
			e1.appendChild(e3.element);
			
			const e4 = new AtomComboBox(this.app, document.createElement("select"));
			
			e4.setPrimitiveValue(e4.element, "valuePath", "value" );
			
			e4.bind(e4.element, "value",  [["localViewModel","month"]], true  );
			
			e4.setPrimitiveValue(e4.element, "items",  this.srCalendar.monthList );
			
			e4.itemTemplate = AtomCalendar_itemTemplate_1_2Creator(this);
			
			e1.appendChild(e4.element);
			
			const e5 = document.createElement("i");
			
			e1.appendChild(e5);
			
			this.runAfterInit( () => this.setLocalValue(e5, "eventClick",  ()=> (this.localViewModel).changeMonth(1)) );
			
			this.setPrimitiveValue(e5, "class", "fas fa-caret-right" );
			
			this.setPrimitiveValue(e5, "title", "Next Month" );
			
			this.setPrimitiveValue(e5, "style", "margin-left: 15px; font-size: 120%; cursor: pointer; padding:0 10px 0 10px;" );
			
			const e6 = new AtomItemsControl(this.app, document.createElement("div"));
			
			e6.setPrimitiveValue(e6.element, "items",  this.srCalendar.weekDays );
			
			e6.setPrimitiveValue(e6.element, "class", "week-days" );
			
			this.append(e6);
			
			const e7 = new AtomItemsControl(this.app, document.createElement("div"));
			
			e7.setPrimitiveValue(e7.element, "class", "month-days" );
			
			e7.bind(e7.element, "itemTemplate",  [["this","itemTemplate"]], false , null , __creator);
			
			e7.bind(e7.element, "items",  [["localViewModel","items"]], false , null );
			
			this.append(e7);
		}
	}
	
	function AtomCalendar_itemTemplate_1_1Creator(__creator) {
		return class AtomCalendar_itemTemplate_1_1 extends AtomControl {
			
			constructor(app: any, e?: any) {
				super(app, e || document.createElement("option"));
			}
			
			public create(): void {
				
				super.create();
				
				this.runAfterInit( () => this.setLocalValue(this.element, "text", ((this.data) ? this.data.label : undefined)) );
			}
		}
	}
	
	function AtomCalendar_itemTemplate_1_2Creator(__creator) {
		return class AtomCalendar_itemTemplate_1_2 extends AtomControl {
			
			constructor(app: any, e?: any) {
				super(app, e || document.createElement("option"));
			}
			
			public create(): void {
				
				super.create();
				
				this.runAfterInit( () => this.setLocalValue(this.element, "text", ((this.data) ? this.data.label : undefined)) );
			}
		}
	}
	
	function AtomCalendar_itemTemplate_3_3Creator(__creator) {
		return class AtomCalendar_itemTemplate_3_3 extends AtomControl {
			
			constructor(app: any, e?: any) {
				super(app, e || document.createElement("div"));
			}
			
			public create(): void {
				
				super.create();
				
				this.runAfterInit( () => this.setLocalValue(this.element, "eventClick",  ()=> (this.localViewModel).dateClicked((this.data))) );
				
				const e1 = document.createElement("div");
				
				this.append(e1);
				
				this.runAfterInit( () => this.setLocalValue(e1, "text", ((this.data) ? this.data.label : undefined)) );
				
				this.bind(e1, "class",  [["data","isOtherMonth"],["data","isToday"],["data","isWeekend"],["localViewModel","selectedDate"],["data","value"],["localViewModel","enableFunc"],["localViewModel"],["data"]], false , (v1,v2,v3,v4,v5,v6,v7,v8) =>  ({
				                'date-css': 1,
				                'is-other-month': (v1),
				                'is-today': (v2),
				                'is-weekend': (v3),
				                'is-selected': (v4) == (v5),
				                'is-disabled': (v6) ? (v7).enableFunc((v8)) : 0
				            })  );
			}
		}
	}