import {BindableProperty} from "web-atoms-core/dist/core/BindableProperty";
import {AtomItemsControl} from "web-atoms-core/dist/web/controls/AtomItemsControl";
import AtomColumn from "./AtomColumn";
import AtomDataGridStyle from "./AtomDataGridStyle";
import AtomDataGridViewModel from "./AtomDataGridViewModel";
import GridTemplate from "./GridTemplate";

declare var UMD: any;
const moduleName = this.filename;
export default class AtomDataGrid extends AtomItemsControl {
    // tslint:disable-next-line: variable-name
    public static readonly _$_url = moduleName ;

    @BindableProperty
    public  columns: any[]  ;

    constructor(app: any, e?: any) {
        super(app, e || document.createElement("table"));
    }

    public append(e): any {
        if (e instanceof AtomColumn) {
            const c = this.columns || (this.columns = []);
            c.push(e);
            return this;
        }
        return super.append(e);
    }

    public preCreate(): void {

        this. columns =  null ;
        this.defaultControlStyle = AtomDataGridStyle;

        this.runAfterInit(() => {
            this.element.className = this.controlStyle.root.className;
        });

        this.localViewModel =  this.resolve(AtomDataGridViewModel, "owner") ;

        this.runAfterInit(() => {

            this.itemTemplate = GridTemplate(this, "dataTemplate", "td");

            const headerTemplate = GridTemplate(this, "headerTemplate", "th");
            const headRow = new (headerTemplate)(this.app, document.createElement("tr"));
            headRow.data = this;
            const head = document.createElement("thead");
            head.appendChild(headRow.element);
            this.append(head);

            const body = document.createElement("tbody");
            this.itemsPresenter = body;
            this.append(body);
        });
    }
}
