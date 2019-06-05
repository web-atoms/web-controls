// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";

    import MenuPageViewModel from "./MenuPageViewModel";

export default  class MenuPage extends AtomControl {

                

                public create(): void {
                    super.create();

                    const __creator = this;

                    

                    this.element = document.createElement("div");
                    
                    
                this.viewModel =  this.resolve(MenuPageViewModel) ;
                    
            const e1 = document.createElement("button");
            
            this.append(e1);
            
                this.setPrimitiveValue(e1, "eventClick",  () => this.viewModel.openListPage() );
            
        const e2 = document.createTextNode("Page 1");
        
        e1.appendChild(e2);

            const e3 = document.createElement("button");
            
            this.append(e3);
            
            
        const e4 = document.createTextNode("Page 2");
        
        e3.appendChild(e4);
                }
            }

            

            