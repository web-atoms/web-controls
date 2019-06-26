// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
	// tslint:disable
	
	export default class CustomHelp extends AtomControl {
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("div"));
		}
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			const e1 = document.createTextNode("\r\n    This is custom help window\r\n    ");
			this.element.appendChild(e1);
			
			const e2 = document.createElement("br");
			
			this.append(e2);
			
			const e3 = document.createElement("span");
			
			this.append(e3);
			
			const e4 = document.createTextNode("With different styles and ");
			e3.appendChild(e4);
			
			const e5 = document.createElement("span");
			
			this.append(e5);
			
			this.setPrimitiveValue(e5, "style", "color: green" );
			
			const e6 = document.createTextNode("colors");
			e5.appendChild(e6);
		}
	}