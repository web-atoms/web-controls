// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";
export default  class HelpPopup extends AtomControl {

                

                public create(): void {
                    super.create();

                    const __creator = this;

                    

                    this.element = document.createElement("div");
                    
                    
        this.setPrimitiveValue(this.element, "style", "padding:10px; margin:5px; border: 1px solid lightgray; background-color: white; border-radius: 5px;" );
        
                    
            const e1 = document.createElement("span");
            
            this.append(e1);
            
            this.bind(e1, "text",  [["viewModel","message"]], false , (v1) => (v1) );
            
                }
            }

            

            