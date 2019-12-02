// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
	
	    import FormattedString from "web-atoms-core/dist/core/FormattedString";
	
	
	declare var UMD: any;
	const __moduleName = this.filename;
	export default class AtomColumn extends AtomControl {
		public static readonly _$_url = __moduleName ;
		
		@BindableProperty
		public  label:  string | FormattedString  ;
		
		@BindableProperty
		public labelPath:  string  ;
		
		@BindableProperty
		public valuePath:  string  ;
		
		@BindableProperty
		public sort:  any  ;
		
		@BindableProperty
		public align:  string  ;
		
		@BindableProperty
		public headerTemplate:  any  ;
		
		@BindableProperty
		public footerTemplate:  any  ;
		
		@BindableProperty
		public dataTemplate:  any  ;
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("th"));
		}
		
		public create(): void {
			
			super.create();
			
			this. label =  null
			        ;
			
			this.labelPath =  null
			        ;
			
			this.valuePath =  null
			        ;
			
			this.sort =  null
			        ;
			
			this.align =  'left'
			        ;
			
			this.headerTemplate =  null
			        ;
			
			this.footerTemplate =  null
			        ;
			
			this.dataTemplate =  null
			    ;
			
			const __creator = this;
			
			this.headerTemplate = AtomColumn_headerTemplate_1_4Creator(this);
			
			this.dataTemplate = AtomColumn_dataTemplate_2_5Creator(this);
		}
	}
	
	function AtomColumn_headerTemplate_1_4Creator(__creator) {
		return class AtomColumn_headerTemplate_1_4 extends AtomControl {
			
			constructor(app: any, e?: any) {
				super(app, e || document.createElement("span"));
			}
			
			public create(): void {
				
				super.create();
				
				this.bind(this.element, "formattedText",  [["this","label"]], false , null , __creator);
			}
		}
	}
	
	function AtomColumn_dataTemplate_2_5Creator(__creator) {
		return class AtomColumn_dataTemplate_2_5 extends AtomControl {
			
			constructor(app: any, e?: any) {
				super(app, e || document.createElement("span"));
			}
			
			public create(): void {
				
				super.create();
				
				this.bind(this.element, "styleTextAlign",  [["this","align"]], false , null , __creator);
				
				this.bind(this.element, "formattedText",  [["localViewModel"],["data"],["this","valuePath"]], false , (v1,v2,v3) => (v1).getItem((v2), (v3)) , __creator);
			}
		}
	}