// tslint:disable
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";
	
	    import MenuPageViewModel from "./MenuPageViewModel";
	
	
	declare var UMD: any;
	const __moduleName = this.filename;
	export default class MenuPage extends AtomControl {
		public static readonly _$_url = __moduleName ;
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("div"));
		}
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			this.viewModel =  this.resolve(MenuPageViewModel) ;
			
			const e1 = document.createElement("button");
			
			this.append(e1);
			
			this.setPrimitiveValue(e1, "eventClick",  () => this.viewModel.openListPage() );
			
			const e2 = document.createTextNode("Page 1");
			e1.appendChild(e2);
			
			const e3 = document.createElement("button");
			
			this.append(e3);
			
			const e4 = document.createTextNode("Page 2");
			e3.appendChild(e4);
		}
	}