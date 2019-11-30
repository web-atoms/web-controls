// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
import {AtomGridView} from "web-atoms-core/dist/web/controls/AtomGridView";
	
	    import GridTestViewModel from "./GridTestViewModel";
	    import AtomDataGrid from "../AtomDataGrid";
	
	
	declare var UMD: any;
	const __moduleName = this.filename;
	export default class GridTest extends AtomGridView {
		public static readonly _$_url = __moduleName ;
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			this.setPrimitiveValue(this.element, "rows", "5, 500 , *" );
			
			this.setPrimitiveValue(this.element, "columns", "5, *, 5" );
			
			this.viewModel =  this.resolve(GridTestViewModel) ;
			
			const e1 = new AtomDataGrid(this.app);
			
			e1.setPrimitiveValue(e1.element, "row", "1" );
			
			e1.setPrimitiveValue(e1.element, "column", "1" );
			
			e1.setPrimitiveValue(e1.element, "uiVirtualize",  true );
			
			e1.setPrimitiveValue(e1.element, "items",  this.viewModel.list );
			
			this.append(e1);
			
			const e2 = document.createElement("div");
			
			this.append(e2);
			
			this.setPrimitiveValue(e2, "rows", "2" );
			
			const e3 = document.createElement("span");
			
			e2.appendChild(e3);
			
			const e4 = document.createTextNode("Footer");
			e3.appendChild(e4);
		}
	}