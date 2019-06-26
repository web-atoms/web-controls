// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
	// tslint:disable
	
	export default class TitleTemplate extends AtomControl {
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("span"));
		}
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			this.bind(this.element, "text",  [["localViewModel","owner","currentPage","title"],["localViewModel","title"]], false , (v1,v2) =>  (v1) || (v2)  );
		}
	}