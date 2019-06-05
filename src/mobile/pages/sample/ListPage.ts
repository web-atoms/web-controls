// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";

    import Page from "../Page";
    import ListPageViewModel from "./ListPageViewModel";

export default  class ListPage extends Page {

                

                public create(): void {
                    super.create();

                    const __creator = this;

                    

                    this.element = document.createElement("div");
                    
                    
                this.viewModel =  this.resolve(ListPageViewModel) ;

        this.commandTemplate = ListPage_commandTemplate_1_11Creator(this);
            
                    
        const e1 = document.createTextNode("\r\n    \r\n    This is a list page;\r\n    ");
        
        this.element.appendChild(e1);

            const e2 = document.createElement("button");
            
            this.append(e2);
            
                this.setPrimitiveValue(e2, "eventClick",  () => this.app.broadcast('root-page', '@web-atoms/web-controls/dist/mobile/pages/sample/DetailPage?canGoBack=true') );
            
        const e3 = document.createTextNode("Open Detail Page");
        
        e2.appendChild(e3);
                }
            }

            function ListPage_commandTemplate_1_11Creator(__creator){
                return  class ListPage_commandTemplate_1_11 extends AtomControl {

                

                public create(): void {
                    super.create();

                     ;

                    

                    this.element = document.createElement("div");
                    
                    
                    
            const e1 = document.createElement("span");
            
            this.append(e1);
            
        this.setPrimitiveValue(e1, "class", "fas fa-filter" );
        

                this.setPrimitiveValue(e1, "eventClick",  () => this.viewModel.openFilter() );
            

            const e2 = document.createElement("span");
            
            this.append(e2);
            
        this.setPrimitiveValue(e2, "class", "fas fa-question-circle" );
        
            
                }
            }

            

            
            }

            