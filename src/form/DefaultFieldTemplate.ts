// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
	
	    import AtomFieldTemplate from "./AtomFieldTemplate";
	
	
	declare var UMD: any;
	const __moduleName = this.filename;
	export default class DefaultFieldTemplate extends AtomFieldTemplate {
		public static readonly _$_url = __moduleName ;
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("div"));
		}
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			this.bind(this.element, "class",  [["this","field","fieldClass"],["this","field","fieldClass"],["this","field","hasError"],["this","field","visible"]], false , (v1,v2,v3,v4) =>  ({
			        'form-field': 1,
			        [(v1)] : (v2),
			        'has-error': (v3),
			        'field-hidden': !(v4)
			    })  , __creator);
			
			const e1 = document.createElement("label");
			
			this.labelPresenter = e1;
			
			this.append(e1);
			
			this.setPrimitiveValue(e1, "class", "label" );
			
			this.bind(e1, "text",  [["this","field","label"]], false , null , __creator);
			
			const e2 = document.createElement("span");
			
			this.append(e2);
			
			this.setPrimitiveValue(e2, "class", "required" );
			
			this.bind(e2, "styleDisplay",  [["this","field","required"]], false , (v1) =>  (v1) ? '' : 'none'  , __creator);
			
			this.setPrimitiveValue(e2, "text", "*" );
			
			const e3 = document.createElement("span");
			
			this.append(e3);
			
			this.setPrimitiveValue(e3, "class", "help" );
			
			this.setPrimitiveValue(e3, "eventClick",  () => this.field.openHelp() );
			
			this.bind(e3, "styleDisplay",  [["this","field","hasHelp"]], false , (v1) => (v1) ? '' : 'none' , __creator);
			
			const e4 = document.createTextNode("?");
			e3.appendChild(e4);
			
			const e5 = document.createElement("div");
			
			this.contentPresenter = e5;
			
			this.append(e5);
			
			this.setPrimitiveValue(e5, "class", "presenter" );
			
			const e6 = document.createElement("span");
			
			this.append(e6);
			
			this.setPrimitiveValue(e6, "class", "error" );
			
			this.bind(e6, "styleDisplay",  [["this","field","hasError"]], false , (v1) =>  (v1) ? '' : 'none'  , __creator);
			
			this.bind(e6, "text",  [["this","field","error"]], false , null , __creator);
		}
	}