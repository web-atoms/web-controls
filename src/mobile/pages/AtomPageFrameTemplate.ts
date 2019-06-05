// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
import {AtomFrame} from "web-atoms-core/dist/web/controls/AtomFrame";

    import AtomPageFrameStyle, { FrameStyle } from "./AtomPageFrameStyle";

export default  class AtomPageFrameTemplate extends AtomControl {

                
            @BindableProperty
            public  url: any;
            
            @BindableProperty
            public  titlePresenter: any;
            
            @BindableProperty
            public  commandPresenter: any;
            

                public create(): void {
                    super.create();

                    const __creator = this;

                    
                this. url =  null;
            ;
                this. titlePresenter =  null;
            ;
                this. commandPresenter =  null ;
            

                    this.element = document.createElement("div");
                    
                    
            this.defaultControlStyle =  AtomPageFrameStyle ;
            

                    this.runAfterInit(() => {
                        this.setPrimitiveValue(this.element, "styleClass",  this.controlStyle.root );
                    });
                    
                    
            const e1 = document.createElement("div");
            
            this.append(e1);
            
        this.setPrimitiveValue(e1, "class", "title-bar" );
        
            
            const e2 = document.createElement("span");
            
            e1.appendChild(e2);
            
            this.bind(e2, "class",  [["localViewModel","canGoBack"]], false , (v1) => `icon fas ${ (v1) ? 'fa-arrow-left' : 'fa-bars' }` );

            this.runAfterInit( () =>
            this.setLocalValue(e2, "eventClick", ()=> (this.localViewModel).iconClick()) );
            

            const e3 = document.createElement("div");
            
        this.titlePresenter = e3;
            e1.appendChild(e3);
            
        this.setPrimitiveValue(e3, "class", "title" );
        
            

            const e4 = document.createElement("div");
            
        this.commandPresenter = e4;
            e1.appendChild(e4);
            
        this.setPrimitiveValue(e4, "class", "commands" );
        
            

            const e5 = new AtomFrame(this.app, document.createElement("div"));
            
            
        e5.setPrimitiveValue(e5.element, "class", "page-host" );
        

            e5.bind(e5.element, "current",  [["localViewModel","owner","currentPage"]], true  );

            e5.bind(e5.element, "url",  [["localViewModel","owner","url"]], false , (v1) => (v1) );

                e5.controlStyle =  FrameStyle ;
            
            this.append(e5);

                }
            }

            

            