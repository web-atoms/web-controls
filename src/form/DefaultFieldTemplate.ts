// tslint:disable
import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomControl} from "web-atoms-core/dist/web/controls/AtomControl";

    import AtomFieldTemplate from "./AtomFieldTemplate";

export default  class DefaultFieldTemplate extends AtomFieldTemplate {

                

                public create(): void {
                    super.create();

                    const __creator = this;

                    

                    this.element = document.createElement("div");
                    
                    
            this.bind(this.element, "class",  [["this","field","hasError"]], false , (v1) =>  ({
        'form-field': 1,
        'has-error': (v1)
    })  , __creator);
                    
            const e1 = document.createElement("label");
            
        this.labelPresenter = e1;
            this.append(e1);
            
        this.setPrimitiveValue(e1, "class", "label" );
        

            this.bind(e1, "text",  [["this","field","label"]], false , (v1) => (v1) , __creator);
            

            const e2 = document.createElement("span");
            
            this.append(e2);
            
        this.setPrimitiveValue(e2, "class", "required" );
        

            this.bind(e2, "styleDisplay",  [["this","field","required"]], false , (v1) =>  (v1) ? '' : 'none'  , __creator);

        this.setPrimitiveValue(e2, "text", "*" );
        
            

            const e3 = document.createElement("span");
            
            this.append(e3);
            
        this.setPrimitiveValue(e3, "class", "help" );
        

                this.setPrimitiveValue(e3, "eventClick",  () => this.field.openHelp() );

            this.bind(e3, "styleDisplay",  [["this","field","hasHelp"]], false , (v1) => (v1) ? '' : 'none' , __creator);
            
        const e4 = document.createTextNode("?");
        
        e3.appendChild(e4);

            const e5 = document.createElement("div");
            
        this.contentPresenter = e5;
            this.append(e5);
            
        this.setPrimitiveValue(e5, "class", "presenter" );
        
            

            const e6 = document.createElement("span");
            
            this.append(e6);
            
        this.setPrimitiveValue(e6, "class", "error" );
        

            this.bind(e6, "styleDisplay",  [["this","field","hasError"]], false , (v1) =>  (v1) ? '' : 'none'  , __creator);

            this.bind(e6, "text",  [["this","field","error"]], false , (v1) => (v1) , __creator);
            
                }
            }

            

            