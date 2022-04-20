import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import TableRepeater from "./TableRepeater";

export interface IDataGridColumn {

    name: string;

    headerClick?: string;

    cellClick?: string;

    footerClick?: string;

    cellRenderer: (item) => XNode;

    headerRenderer?: (item) => XNode;

    footerRenderer?: (item) => XNode;

}

export default class DataGrid extends TableRepeater {

    @BindableProperty
    public columns: IDataGridColumn[];

    constructor(app, e) {
        super(app, e ?? document.createElement("table"));
    }

    protected preCreate(): void {
        super.preCreate();
        this.header = null;
        this.footer = null;
        this.headerRenderer = (item) => <tr>
            { ... this.columns.map((x) => {
                const node = x.headerRenderer?.(item) ?? <td>
                    <span text={x.name ?? ""}/>
                </td>;
                const na = node.attributes ??= {};
                if (na["data-click-event"] === void 0) {
                    na["data-click-event"] = x.headerClick ?? `header-${x.name}-click`;
                }
                return node;
            })}
        </tr>;
        this.itemRenderer = (item) => <tr>
            { ... this.columns.map((x) => {
                const node = x.cellRenderer(item);
                const na = node.attributes ??= {};
                if (na["data-click-event"] === void 0) {
                    na["data-click-event"] = x.cellClick ?? `cell-${x.name}-click`;
                }
                na["data-recreate"] = true;
                return node;
            })}
        </tr>;
        this.footerRenderer = (item) => <tr>
            { ... this.columns.map((x) => {
                const node = x.footerRenderer?.(item) ?? <td>
                    <span text={x.name ?? ""}/>
                </td>;
                const na = node.attributes ??= {};
                if (na["data-click-event"] === void 0) {
                    na["data-click-event"] = x.footerClick ?? `footer-${x.name}-click`;
                }
                return node;
            })}
        </tr>;

    }
}


