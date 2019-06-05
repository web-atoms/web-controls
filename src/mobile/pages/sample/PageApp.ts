// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";

    import AtomPageFrame from "../AtomPageFrame";

export default  class PageApp extends AtomPageFrame {

                

                public create(): void {
                    super.create();

                    const __creator = this;

                    

                    
                    
                    
        this.setPrimitiveValue(this.element, "url", "@web-atoms/web-controls/dist/mobile/pages/sample/HomePage" );
        

        this.setPrimitiveValue(this.element, "menuUrl", "@web-atoms/web-controls/dist/mobile/pages/sample/MenuPage" );
        
                    
                }
            }

            

            