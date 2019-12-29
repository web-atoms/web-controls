// tslint:disable
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
	
	    import AtomPageFrame from "../AtomPageFrame";
	
	
	declare var UMD: any;
	const __moduleName = this.filename;
	export default class PageApp extends AtomPageFrame {
		public static readonly _$_url = __moduleName ;
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			this.setPrimitiveValue(this.element, "url", "@web-atoms/web-controls/dist/mobile/pages/sample/HomePage" );
			
			this.setPrimitiveValue(this.element, "menuUrl", "@web-atoms/web-controls/dist/mobile/pages/sample/MenuPage" );
		}
	}