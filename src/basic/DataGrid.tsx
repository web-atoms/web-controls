import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import { StringHelper } from "@web-atoms/core/dist/core/StringHelper";
import XNode from "@web-atoms/core/dist/core/XNode";
import TableRepeater from "./TableRepeater";

const cellEventName = Symbol("cell-event-name");
const headerEventName = Symbol("header-event-name");
const footerEventName = Symbol("footer-event-name");

const getCellEventName = (d: IDataGridColumn) => {
    let name = d[cellEventName];
    if (name !== void 0) {
        return name;
    }
    name = StringHelper.fromHyphenToCamel(d.cellClickEvent ?? `cell-${d.header}-click`);
    d[cellEventName] = name;
    return name;
}

const getHeaderEventName = (d: IDataGridColumn) => {
    let name = d[headerEventName];
    if (name !== void 0) {
        return name;
    }
    name = StringHelper.fromHyphenToCamel(d.headerClickEvent ?? `header-${d.header}-click`);
    d[headerEventName] = name;
    return name;
}

const getFooterEventName = (d: IDataGridColumn) => {
    let name = d[footerEventName];
    if (name !== void 0) {
        return name;
    }
    name = StringHelper.fromHyphenToCamel(d.footerClickEvent ?? `footer-${d.header}-click`);
    d[footerEventName] = name;
    return name;
}

export interface IDataGridColumnBase {
    header: string;
    headerSortUp?: any;
    headerSortDown?: any;
    headerSortDefault?: any;
    headerClickEvent?: string;

    cellClickEvent?: string;

    footerClickEvent?: string;

    headerRenderer?: (item) => XNode;

    footerRenderer?: (item) => XNode;

    headerClickHandler?: (e: CustomEvent) => void;
    cellClickHandler?: (e: CustomEvent) => void;
    footerClickHandler?: (e: CustomEvent) => void;

}

export interface IDataGridColumnWithLabel extends IDataGridColumnBase {
    label: string;
    labelPath?: never;
    cellRenderer?: never;
}

export interface IDataGridColumnWithLabelPath extends IDataGridColumnBase {
    labelPath: (item) => string;
    label?: never;
    cellRenderer?: never;
}

export interface IDataGridColumnWithCellRenderer extends IDataGridColumnBase {
    cellRenderer: (item) => XNode;
    label?: never;
    labelPath?: never;
}

export type IDataGridColumn = IDataGridColumnWithLabel | IDataGridColumnWithLabelPath | IDataGridColumnWithCellRenderer;

// export interface IDataGridColumn {

//     header: string;

//     headerClickEvent?: string;

//     cellClickEvent?: string;

//     footerClickEvent?: string;

//     cellRenderer: (item) => XNode;

//     headerRenderer?: (item) => XNode;

//     footerRenderer?: (item) => XNode;

//     headerClickHandler?: (e: CustomEvent) => void;
//     cellClickHandler?: (e: CustomEvent) => void;
//     footerClickHandler?: (e: CustomEvent) => void;

// }

export default class DataGrid extends TableRepeater {

    @BindableProperty
    public columns: IDataGridColumn[];

    @BindableProperty
    public orderBy: any;

    private orderBySet: boolean;

    constructor(app, e) {
        super(app, e ?? document.createElement("table"));
    }

    public onPropertyChanged(name: keyof DataGrid): void {
        super.onPropertyChanged(name as any);
        if (name === "columns") {
            super.onPropertyChanged("header");
            super.onPropertyChanged("footer");
            super.onPropertyChanged("items");
        }
        if (name === "orderBy") {
            if (!this.orderBySet) {
                this.onPropertyChanged("header");
            }
            this.orderBySet = true;
        }
    }

    protected preCreate(): void {
        super.preCreate();
        this.header = null;
        this.footer = null;
        this.headerRenderer = (item) => <tr>
            { ... this.columns?.map?.((x) => {
                if (x.headerRenderer === void 0) {
                    x.headerRenderer = (item) => {
                        let order = this.orderBy;
                        if (order !== void 0) {
                            if (order === x.headerSortUp) {
                                order = false;
                            } else if (order === x.headerSortDown) {
                                order = true;
                            }
                        }
                        return <th>
                        <span text={x.header}/>
                            { typeof order === "boolean" &&
                                (order ? <i class="fa-solid fa-sort-down"/> : <i class="fa-solid fa-sort-up"/>) }
                        </th>;
                    };
                }
                const node = x.headerRenderer(item);
                const na = node.attributes ??= {};
                if (na["data-click-event"] === void 0) {
                    na["data-click-event"] = getHeaderEventName(x);
                }
                return node;
            }) ?? []}
        </tr>;
        this.itemRenderer = (item) => <tr>
            { ... this.columns?.map?.((x) => {
                if (x.cellRenderer === void 0) {
                    x.labelPath ??= (item) => item[x.label];
                    x.cellRenderer = (item) => <td text={x.labelPath(item)}/>;
                }
                const node = x.cellRenderer?.(item);
                const na = node.attributes ??= {};
                if (na["data-click-event"] === void 0) {
                    na["data-click-event"] = getCellEventName(x);
                }
                return node;
            }) ?? []}
        </tr>;
        this.footerRenderer = (item) => <tr>
            { ... this.columns?.map?.((x) => {
                const node = x.footerRenderer?.(item);
                if (node === void 0) {
                    return node;
                }
                const na = node.attributes ??= {};
                if (na["data-click-event"] === void 0) {
                    na["data-click-event"] = getFooterEventName(x);
                }
                return node;
            }) ?? [] }        
        </tr>;
    }

    protected dispatchHeaderFooterEvent(eventName: any, type: any, originalTarget: any): void {
        let detail = this[type]

        const column = this.columns.find((x) => getHeaderEventName(x) === eventName || getFooterEventName(x) === eventName);

        let order = this.orderBy;
        const originalOrder = this.orderBy;

        const isHeader = type === "header";

        if (isHeader) {
            if (order === column.headerSortDown) {
                order = column.headerSortUp;
            } else if (order === column.headerSortUp) {
                order = column.headerSortDown;
            } else {
                order = column.headerSortDefault ?? column.headerSortUp;
            }
            detail = {
                detail,
                type,
                order
            };
        }
        const ce = new CustomEvent(eventName ?? `${type}Click`, {
            detail,
            bubbles: this.bubbleEvents,
            cancelable: true
        });
        originalTarget.dispatchEvent(ce);
        if (ce.defaultPrevented) {
            return;
        }

        if (isHeader) {
            column.headerClickHandler?.(ce);
        } else {
            column.footerClickHandler?.(ce);
        }

        if (ce.defaultPrevented) {
            return;
        }
        if (isHeader && this.orderBy === originalOrder) {
            this.orderBy = order;
        }
        this.onPropertyChanged(type);
    }

    protected dispatchItemEvent(eventName: any, item: any, recreate: any, originalTarget: any): void {
        const ce = new CustomEvent(eventName ?? "itemClick", {
            detail: item,
            bubbles: this.bubbleEvents,
            cancelable: true
        });
        originalTarget.dispatchEvent(ce);
        if (ce.defaultPrevented) {
            return;
        }
        for (const iterator of this.columns) {
            if (getCellEventName(iterator) === eventName) {
                iterator.cellClickHandler?.(ce);
                break;
            }
        }
        if (ce.defaultPrevented) {
            return;
        }
        if (recreate) {
            this.refreshItem(item, (ce as any).promise);
        }
    }
}


