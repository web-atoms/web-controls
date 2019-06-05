// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
export default  class TitleTemplate extends AtomControl {

                

                public create(): void {
                    super.create();

                    const __creator = this;

                    

                    this.element = document.createElement("span");
                    
                    
            this.bind(this.element, "text",  [["localViewModel","owner","currentPage","title"],["localViewModel","title"]], false , (v1,v2) =>  (v1) || (v2)  );
                    
                }
            }

            

            