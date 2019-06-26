// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
	
	    import Page from "../Page";
	
	
	export default class DetailPage extends Page {
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("div"));
		}
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			this.setPrimitiveValue(this.element, "title", "Detail Page" );
			
			const e1 = document.createTextNode("\r\n    This is detail page...\r\n");
			this.element.appendChild(e1);
		}
	}