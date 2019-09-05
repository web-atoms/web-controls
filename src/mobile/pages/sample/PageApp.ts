// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
	
	    import AtomPageFrame from "../AtomPageFrame";
	
	
	export default class PageApp extends AtomPageFrame {
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			this.setPrimitiveValue(this.element, "url", "@web-atoms/web-controls/dist/mobile/pages/sample/HomePage" );
			
			this.setPrimitiveValue(this.element, "menuUrl", "@web-atoms/web-controls/dist/mobile/pages/sample/MenuPage" );
			
			this.tabsTemplate = PageApp_tabsTemplate_1_7Creator(this);
		}
	}
	
	function PageApp_tabsTemplate_1_7Creator(__creator) {
		return class PageApp_tabsTemplate_1_7 extends AtomControl {
			
			constructor(app: any, e?: any) {
				super(app, e || document.createElement("div"));
			}
			
			public create(): void {
				
				super.create();
				
				const e1 = document.createElement("div");
				
				this.append(e1);
				
				const e2 = document.createTextNode("tab 1");
				e1.appendChild(e2);
			}
		}
	}