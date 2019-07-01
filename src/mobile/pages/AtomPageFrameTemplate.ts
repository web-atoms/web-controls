// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
	
	    import AtomPageFrameStyle, { FrameStyle } from "./AtomPageFrameStyle";
	
	
	export default class AtomPageFrameTemplate extends AtomControl {
		
		@BindableProperty
		public  url:  string  ;
		
		@BindableProperty
		public titlePresenter:  HTMLElement ;
		
		@BindableProperty
		public commandPresenter: HTMLElement ;
		
		@BindableProperty
		public  pagePresenter:  HTMLElement  ;
		
		constructor(app: any, e?: any) {
			super(app, e || document.createElement("div"));
		}
		
		public create(): void {
			
			super.create();
			
			const __creator = this;
			
			this.defaultControlStyle =  AtomPageFrameStyle ;
			
			this.runAfterInit(() => this.setPrimitiveValue(this.element, "styleClass",  this.controlStyle.root ));
			
			const e1 = document.createElement("div");
			
			this.append(e1);
			
			this.setPrimitiveValue(e1, "class", "title-bar" );
			
			const e2 = document.createElement("span");
			
			e1.appendChild(e2);
			
			this.bind(e2, "class",  [["localViewModel","owner","canGoBack"]], false , (v1) => `icon fas ${ (v1) ? 'fa-arrow-left' : 'fa-bars' }` );
			
			this.runAfterInit( () => this.setLocalValue(e2, "eventClick", ()=> (this.localViewModel).iconClick()) );
			
			const e3 = document.createElement("div");
			
			this.titlePresenter = e3;
			
			e1.appendChild(e3);
			
			this.setPrimitiveValue(e3, "class", "title" );
			
			const e4 = document.createElement("div");
			
			this.commandPresenter = e4;
			
			e1.appendChild(e4);
			
			this.setPrimitiveValue(e4, "class", "commands" );
			
			const e5 = document.createElement("div");
			
			this.pagePresenter = e5;
			
			this.append(e5);
			
			this.setPrimitiveValue(e5, "class", "page-presenter" );
		}
	}