import { App } from "web-atoms-core/dist/App";
import { Inject } from "web-atoms-core/dist/di/Inject";
import { AtomViewModel, Watch } from "web-atoms-core/dist/view-model/AtomViewModel";
import Load from "web-atoms-core/dist/view-model/Load";
import AtomColumn from "./AtomColumn";

interface IDataGrid {
    columns: AtomColumn[];
    items: any[];
}

export default class AtomDataGridViewModel extends AtomViewModel {

    public owner: IDataGrid;

    @Inject
    public app: App;

    @Watch
    public watchInit() {

        if (!this.owner) {
            return;
        }

        const data = this.owner.items;

        if (!data) {
            return;
        }

        let columns = this.owner.columns;

        if (columns && columns.length) {
            return;
        }

        const columnList: {[k: string]: AtomColumn} = {  };
        columns = [];
        // prepare column list... from all items...
        for (const iterator of data) {
            for (const key in iterator) {
                if (columnList[key]) {
                    continue;
                }
                if (iterator.hasOwnProperty(key)) {
                    const v = iterator[key];
                    const c = new AtomColumn(this.app);
                    c.label = key;
                    c.labelPath = key;
                    c.valuePath = key;
                    c.align = "left";
                    if (typeof v !== "string") {
                        c.align = "right";
                        c.sort = (a: number, b: number) => a > b ? -1 : 1;
                    } else {
                        c.sort = (a: string, b: string) => a.localeCompare(b);
                    }
                    columns.push(c);
                    columnList[key] = c;
                }
            }
        }

        setTimeout(() => {
            this.owner.columns = columns;
        }, 1);
    }

    public getItem(data, valuePath) {
        return data[valuePath];
    }

}
