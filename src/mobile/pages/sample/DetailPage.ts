// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";

    import Page from "../Page";

export default  class DetailPage extends Page {

                

                public create(): void {
                    super.create();

                    const __creator = this;

                    

                    this.element = document.createElement("div");
                    
                    
        this.setPrimitiveValue(this.element, "title", "Detail Page" );
        
                    
        const e1 = document.createTextNode("\r\n    This is detail page...\r\n");
        
        this.element.appendChild(e1);
                }
            }

            

            