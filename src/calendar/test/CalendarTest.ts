// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
	
	    import AtomCalendar from "../AtomCalendar";
	
	
	declare var UMD: any;
	const __moduleName = this.filename;
	export default class CalendarTest extends AtomControl {
		public static readonly _$_url = __moduleName ;
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("div"));
		}
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			const e1 = new AtomCalendar(this.app);
			
			this.append(e1);
		}
	}