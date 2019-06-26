// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
	
	    import AtomForm from "../AtomForm";
	    import AtomField from "../AtomField";
	    import FormViewModel from "./FormViewModel";
	
	
	export default class FormTest extends AtomControl {
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("div"));
		}
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			this.viewModel =  this.resolve(FormViewModel) ;
			
			const e1 = new AtomForm(this.app);
			
			e1.setPrimitiveValue(e1.element, "eventSubmit",  () => alert('done') );
			
			e1.setPrimitiveValue(e1.element, "focusNextOnEnter",  true );
			
			const e2 = new AtomField(this.app);
			
			e2.setPrimitiveValue(e2.element, "label", "Name:" );
			
			e2.setPrimitiveValue(e2.element, "required", "true" );
			
			e2.bind(e2.element, "error",  [["viewModel","errorName"]], false , null );
			
			e2.setPrimitiveValue(e2.element, "helpText", "Enter your full name" );
			
			const e3 = document.createElement("input");
			
			e2.append(e3);
			
			e2.setPrimitiveValue(e3, "type", "text" );
			
			e2.bind(e3, "value",  [["viewModel","model","name"]], true  );
			
			e1.append(e2);
			
			const e4 = new AtomField(this.app);
			
			e4.setPrimitiveValue(e4.element, "label", "Email:" );
			
			e4.setPrimitiveValue(e4.element, "required", "true" );
			
			e4.bind(e4.element, "error",  [["viewModel","errorEmail"]], false , null );
			
			e4.setPrimitiveValue(e4.element, "helpLink", "@web-atoms/web-controls/dist/form/test/CustomHelp" );
			
			const e5 = document.createElement("input");
			
			e4.append(e5);
			
			e4.setPrimitiveValue(e5, "class", "submit" );
			
			e4.bind(e5, "value",  [["viewModel","model","email"]], true  );
			
			e1.append(e4);
			
			const e6 = new AtomField(this.app);
			
			const e7 = document.createTextNode("\r\n            This is simple display text without label and anything\r\n        ");
			e6.element.appendChild(e7);
			
			e1.append(e6);
			
			this.append(e1);
			
			const e8 = document.createElement("button");
			
			this.append(e8);
			
			this.setPrimitiveValue(e8, "eventClick",  () => this.viewModel.save() );
			
			const e9 = document.createTextNode("Save");
			e8.appendChild(e9);
		}
	}