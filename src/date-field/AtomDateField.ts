// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
import {AtomWindow} from "web-atoms-core/dist/web/controls/AtomWindow";
	
	    import AtomPopupButton from "../buttons/AtomPopupButton";
	    import AtomCalendar from "../calendar/AtomCalendar";
	    import SRCalendar from "../calendar/res/SRCalendar";
	
	
	export default class AtomDateField extends AtomPopupButton {
		
		protected srCalendar:  SRCalendar;
		
		@BindableProperty
		public  selectedDate:  Date  ;
		
		@BindableProperty
		public  yearStart: any  ;
		
		@BindableProperty
		public  yearEnd:  any  ;
		
		@BindableProperty
		public  enableFunc:  any  ;
		
		@BindableProperty
		public  currentMonth:  any ;
		
		@BindableProperty
		public  itemTemplate:  any ;
		
		constructor(app: any, e?: any) {
			super(app, e);
		}
		
		public create(): void {
			
			super.create();
			
			this.srCalendar = this.app.resolve( SRCalendar);
			
			this. selectedDate =  null;
			
			this. yearStart =  -10;
			
			this. yearEnd =  10;
			
			this. enableFunc =  null;
			
			const __creator = this;
			
			this.bind(this.element, "text",  [["this","selectedDate"],["this","selectedDate"]], false , (v1,v2) => (v1) ? this.srCalendar.toShortDate((v2)) : 'Select Date' , __creator);
			
			this.setPrimitiveValue(this.element, "eventResult",  (e) => this.selectedDate = e.detail );
			
			this.popupTemplate = AtomDateField_popupTemplate_1_56Creator(this);
		}
	}
	
	function AtomDateField_popupTemplate_1_56Creator(__creator) {
		return class AtomDateField_popupTemplate_1_56 extends AtomCalendar {
			
			public create(): void {
				
				super.create();
				
				this.bind(this.element, "selectedDate",  [["this","selectedDate"]], true  ,null, __creator);
				
				this.bind(this.element, "yearStart",  [["this","yearStart"]], false , null , __creator);
				
				this.bind(this.element, "yearEnd",  [["this","yearEnd"]], false , null , __creator);
				
				this.bind(this.element, "enableFunc",  [["this","enableFunc"]], false , null , __creator);
				
				this.bind(this.element, "itemTemplate",  [["this","itemTemplate"]], false , null , __creator);
				
				this.runAfterInit( () => this.setLocalValue(this.element, "eventDateClicked",  (e) => (this.viewModel).close(e.detail.value) ) );
			}
		}
	}