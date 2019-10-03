// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
	
	    import Page from "../Page";
	    import ListPageViewModel from "./ListPageViewModel";
	
	
	declare var UMD: any;
	const __moduleName = this.filename;
	export default class ListPage extends Page {
		public static readonly _$_url = __moduleName ;
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("div"));
		}
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			this.setPrimitiveValue(this.element, "title", "List Page" );
			
			this.viewModel =  this.resolve(ListPageViewModel) ;
			
			this.commandTemplate = ListPage_commandTemplate_1_7Creator(this);
			
			const e1 = document.createTextNode("\r\n    \r\n    This is a list page;\r\n    ");
			this.element.appendChild(e1);
			
			const e2 = document.createElement("button");
			
			this.append(e2);
			
			this.setPrimitiveValue(e2, "eventClick",  () => this.viewModel.openDetail() );
			
			const e3 = document.createTextNode("Open Detail Page");
			e2.appendChild(e3);
		}
	}
	
	function ListPage_commandTemplate_1_7Creator(__creator) {
		return class ListPage_commandTemplate_1_7 extends AtomControl {
			
			constructor(app: any, e?: any) {
				super(app, e || document.createElement("div"));
			}
			
			public create(): void {
				
				super.create();
				
				const e1 = document.createElement("span");
				
				this.append(e1);
				
				this.setPrimitiveValue(e1, "class", "fas fa-filter" );
				
				this.setPrimitiveValue(e1, "eventClick",  () => this.viewModel.openFilter() );
				
				const e2 = document.createElement("span");
				
				this.append(e2);
				
				this.setPrimitiveValue(e2, "class", "fas fa-question-circle" );
			}
		}
	}