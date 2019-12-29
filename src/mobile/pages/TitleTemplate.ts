// tslint:disable
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";
	// tslint:disable
	
	declare var UMD: any;
	const __moduleName = this.filename;
	export default class TitleTemplate extends AtomControl {
		public static readonly _$_url = __moduleName ;
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("span"));
		}
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			this.bind(this.element, "text",  [["localViewModel","owner","current","title"],["localViewModel","title"]], false , (v1,v2) =>  (v1) || (v2)  );
		}
	}