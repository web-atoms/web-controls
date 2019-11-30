// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
	
	    import Page from "../Page";
	
	
	declare var UMD: any;
	const __moduleName = this.filename;
	export default class DetailPage extends Page {
		public static readonly _$_url = __moduleName ;
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("div"));
		}
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			this.setPrimitiveValue(this.element, "title", "Detail Page" );
			
			this.tabsTemplate = DetailPage_tabsTemplate_1_7Creator(this);
			
			const e1 = document.createTextNode("\r\n    This is detail page...\r\n    ");
			this.element.appendChild(e1);
		}
	}
	
	function DetailPage_tabsTemplate_1_7Creator(__creator) {
		return class DetailPage_tabsTemplate_1_7 extends AtomControl {
			
			constructor(app: any, e?: any) {
				super(app, e || document.createElement("div"));
			}
			
			public create(): void {
				
				super.create();
				
				const e1 = document.createElement("div");
				
				this.append(e1);
				
				const e2 = document.createTextNode("Page Tab");
				e1.appendChild(e2);
			}
		}
	}