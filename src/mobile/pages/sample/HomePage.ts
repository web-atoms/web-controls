// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
	
	    import Page from "../Page";
	
	
	export default class HomePage extends Page {
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("div"));
		}
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			this.setPrimitiveValue(this.element, "title", "Home Page" );
			
			this.commandTemplate = HomePage_commandTemplate_1_1Creator(this);
			
			const e1 = document.createTextNode("\r\n    This is home page...\r\n");
			this.element.appendChild(e1);
		}
	}
	
	function HomePage_commandTemplate_1_1Creator(__creator) {
		return class HomePage_commandTemplate_1_1 extends AtomControl {
			
			constructor(app: any, e?: any) {
				super(app, e || document.createElement("div"));
			}
			
			public create(): void {
				
				super.create();
				
				const e1 = document.createElement("span");
				
				this.append(e1);
				
				this.setPrimitiveValue(e1, "class", "fas fa-question-circle" );
			}
		}
	}