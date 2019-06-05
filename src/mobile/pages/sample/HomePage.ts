// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";

    import Page from "../Page";

export default  class HomePage extends Page {

                

                public create(): void {
                    super.create();

                    const __creator = this;

                    

                    this.element = document.createElement("div");
                    
                    
        this.commandTemplate = HomePage_commandTemplate_1_8Creator(this);
            
                    
        const e1 = document.createTextNode("\r\n    This is home page...\r\n");
        
        this.element.appendChild(e1);
                }
            }

            function HomePage_commandTemplate_1_8Creator(__creator){
                return  class HomePage_commandTemplate_1_8 extends AtomControl {

                

                public create(): void {
                    super.create();

                     ;

                    

                    this.element = document.createElement("div");
                    
                    
                    
            const e1 = document.createElement("span");
            
            this.append(e1);
            
        this.setPrimitiveValue(e1, "class", "fas fa-question-circle" );
        
            
                }
            }

            

            
            }

            