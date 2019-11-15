// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomPageLink} from "web-atoms-core/dist/web/controls/AtomPageLink";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
	
	    import AtomDateField from "../AtomDateField";
	
	
	declare var UMD: any;
	const __moduleName = this.filename;
	export default class PopupTest extends AtomControl {
		public static readonly _$_url = __moduleName ;
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("div"));
		}
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			const e1 = new AtomPageLink(this.app, document.createElement("button"));
			
			e1.setPrimitiveValue(e1.element, "text", "Add New" );
			
			e1.page = PopupTest_page_1_10Creator(this);
			
			this.append(e1);
		}
	}
	
	function PopupTest_page_1_10Creator(__creator) {
		return class PopupTest_page_1_10 extends AtomControl {
			
			constructor(app: any, e?: any) {
				super(app, e || document.createElement("div"));
			}
			
			public create(): void {
				
				super.create();
				
				const e1 = document.createElement("div");
				
				this.append(e1);
				
				const e2 = document.createTextNode("\r\n                Select Date\r\n            ");
				e1.appendChild(e2);
				
				const e3 = new AtomDateField(this.app);
				
				this.append(e3);
			}
		}
	}