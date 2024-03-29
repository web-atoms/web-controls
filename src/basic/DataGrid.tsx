import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater, { getParentRepeaterItem, SelectorCheckBox } from "./AtomRepeater";
import { EditableInput, getPropertyInfo, IPropertyInfo } from "./Editable";
import TableRepeater from "./TableRepeater";

import "./styles/data-grid-style";

const cellEventName = Symbol("cell-event-name");
const headerEventName = Symbol("header-event-name");
const footerEventName = Symbol("footer-event-name");

const fromHyphenToCamel = (input: string) => input.replace(/-([a-z])/ig, (g) => g[1].toUpperCase());

const toEventName = (name: string) => {
    const r = fromHyphenToCamel(name.replace(/\s+/, "-"));
    return r[0].toLowerCase() + r.substring(1);
};

const getCellEventName = (d: IDataGridColumn) => {
    let name = d[cellEventName];
    if (name !== void 0) {
        return name;
    }
    name = toEventName(d.cellClickEvent ?? `cell-${d.header}-click`);
    d[cellEventName] = name;
    return name;
};

const getHeaderEventName = (d: IDataGridColumn) => {
    let name = d[headerEventName];
    if (name !== void 0) {
        return name;
    }
    name = toEventName(d.headerClickEvent ?? `header-${d.header}-click`);
    d[headerEventName] = name;
    return name;
};

const getFooterEventName = (d: IDataGridColumn) => {
    let name = d[footerEventName];
    if (name !== void 0) {
        return name;
    }
    name = toEventName(d.footerClickEvent ?? `footer-${d.header}-click`);
    d[footerEventName] = name;
    return name;
};

export interface IDataGridColumnBase {
    header: string;
    headerSort?: any;
    headerSortDescending?: any;
    headerSortDefault?: any;
    headerClickEvent?: string;

    cellClickEvent?: string;

    footerClickEvent?: string;

    headerRenderer?: (item) => XNode;

    footerRenderer?: (item) => XNode;

    headerClickHandler?: (e: CustomEvent) => void;
    cellClickHandler?: (e: CustomEvent) => void;
    footerClickHandler?: (e: CustomEvent) => void;

    /**
     * Default is true
     */
    ellipsis?: boolean;
    width?: string;
    maxWidth?: string;
    minWidth?: string;

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


export const SelectAllColumn: IDataGridColumn = {
    header: "Select All",
    headerRenderer: () => <th>
        <input
            type="checkbox"
            checked={Bind.oneTime((x: any) => x.allSelected)}/>
    </th>,
    headerClickHandler: (e) => {
        const s = e.detail.repeater as AtomRepeater;
        const items = s.items;
        if (!(items)) {
            return;
        }
        const selectedItems = s.selectedItems ??= [];
        if (s.allSelected) {
            selectedItems.clear();
            return;
        }
        selectedItems.length = 0;
        selectedItems.push(... items);
        selectedItems.refresh();
    },
    cellRenderer: () => <SelectorCheckBox/>
};

export interface IEditorColumn {
    header: string;
    changeEvents?: string[];
    editorValuePath?: (editor) => any;
    propertyPath: string[] | string | IPropertyInfo ;
}

export function InputColumn({
    type = "text",
    header,
    propertyPath
}: IEditorColumn & { type?: string}): IDataGridColumn {
    const property = getPropertyInfo(propertyPath);
    return ({
        header,
        cellRenderer: (item) => <EditableInput
            propertyPath={propertyPath}
            value={property.getter(item)}
            type={type}/>,
    });
}

export default class DataGrid extends TableRepeater {

    @BindableProperty
    public columns: IDataGridColumn[];

    @BindableProperty
    public orderBy: any;

    private orderBySet: boolean;

    constructor(app, e = document.createElement("table")) {
        super(app, e);
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
        this.header = true;
        this.footer = null;
        this.element.dataset.dataGrid = "data-grid";
        this.headerRenderer = (item) => <tr>
            { ... this.columns?.map?.((x) => {
                if (x.headerRenderer === void 0) {
                    x.headerRenderer = (_) => {
                        let order = this.orderBy;
                        if (order !== void 0) {
                            if (order === x.headerSort) {
                                order = true;
                            } else if (order === x.headerSortDescending) {
                                order = false;
                            }
                        }
                        return <th>
                        <span data-recreate="true" text={x.header} title={x.header}/>
                            { typeof order === "boolean" &&
                                (order
                                    ? <i data-sort="up" class="fa-solid fa-arrow-up-short-wide"/>
                                    : <i data-sort="down" class="fa-solid fa-arrow-down-wide-short"/>) }
                        </th>;
                    };
                }
                const node = x.headerRenderer(item);
                const na = node.attributes ??= {};
                na["data-click-event"] ??= getHeaderEventName(x);
                if (x.width !== void 0) {
                    na["style-width"] ??= x.width;
                } else {
                    if (x.maxWidth !== void 0) {
                        na["style-max-width"] ??= x.maxWidth;
                    }
                    if (x.minWidth !== void 0) {
                        na["style-min-width"] ??= x.minWidth;
                    }
                }
                return node;
            }) ?? []}
        </tr>;
        this.itemRenderer = (item) => <tr>
            { ... this.columns?.map?.((x) => {
                x.ellipsis ??= true;
                if (x.cellRenderer === void 0) {
                    x.labelPath ??= (i) => i[x.label];
                    if (x.ellipsis) {
                        x.cellRenderer = (i) => <td text={x.labelPath(i)}/>;
                    } else {
                        x.cellRenderer = (i) => <td text={x.labelPath(i)} title={x.labelPath(i)}/>;
                    }
                }
                const node = x.cellRenderer?.(item);
                const na = node.attributes ??= {};
                if (x.ellipsis) {
                    na["data-ellipsis"] = "true";
                }
                na["data-click-event"] ??= getCellEventName(x);
                if (x.width !== void 0) {
                    na["style-width"] ??= x.width;
                } else {
                    if (x.maxWidth !== void 0) {
                        na["style-max-width"] ??= x.maxWidth;
                    }
                    if (x.minWidth !== void 0) {
                        na["style-min-width"] ??= x.minWidth;
                    }
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

    protected dispatchHeaderFooterEvent(eventName: any, type: any, recreate: boolean, originalTarget: any): void {
        let detail = this[type];

        const column = this.columns.find((x) => getHeaderEventName(x) === eventName
            || getFooterEventName(x) === eventName);

        let order = this.orderBy;
        const originalOrder = this.orderBy;

        const isHeader = type === "header";
        const setOrderBy = isHeader && column.headerSort !== void 0;

        if (isHeader) {
            if (setOrderBy) {
                if (order === column.headerSortDescending) {
                    order = column.headerSort;
                } else if (order === column.headerSort) {
                    order = column.headerSortDescending;
                } else {
                    order = column.headerSortDefault ?? column.headerSort;
                }
            }
            detail = {
                repeater: this,
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

        this.invokeHandler(isHeader ? column.headerClickHandler : column.footerClickHandler, ce);

        if (ce.defaultPrevented) {
            return;
        }
        if (setOrderBy && this.orderBy === originalOrder) {
            this.orderBy = order;
            (ce as any).executed = true;
        }
        if ((ce as any).executed) {
            this.onPropertyChanged(type);
        }
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
                this.invokeHandler(iterator.cellClickHandler, ce);
                break;
            }
        }
        if (ce.defaultPrevented) {
            return;
        }
        if (eventName === "itemSelect" || eventName === "itemDeselect") {
            const si = this.selectedItems ??= [];
            if (si) {
                const index = si.indexOf(item);
                if (index === -1) {
                    if (this.allowMultipleSelection) {
                        si.add(item);
                    } else {
                        si.set(0, item);
                    }
                } else {
                    si.removeAt(index);
                }
            }
        }
        if (recreate && (ce as any).executed) {
            this.refreshItem(item, (ce as any).promise);
        }
    }

    private invokeHandler(h, e) {
        if (!h) {
            return;
        }
        const p = h(e);
        e.executed = true;
        if (p && p.then) {
            if (e.promise) {
                e.promise = Promise.all([e.promise, p]);
            } else {
                e.promise = p;
            }
            p?.catch((error) => {
                if (CancelToken.isCancelled(error)) {
                    return;
                }
                // tslint:disable-next-line: no-console
                console.error(error);
            });
        }
    }
}
