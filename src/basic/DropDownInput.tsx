import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import Bind from "@web-atoms/core/dist/core/Bind";
import { IDisposable } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";

let dlID = 1;

export default class DropDownInput extends AtomControl {

    items: any[];
    labelPath: string | any;
    valuePath: string | any;
    input: HTMLInputElement;
    labelElement: HTMLLabelElement;

    itemsDisposable: IDisposable;
    updateTimeout;
    datalist: HTMLDataListElement;
    value: any;
    map: Map<string,string>;

    constructor(app, e = document.createElement("drop-down-input")) {
        super(app, e);
    }

    protected preCreate(): void {
        this.items = null;
        this.value = null;
        this.map = new Map();
        this.valuePath = (v) => v?.value ?? v;
        this.labelPath = (v) => v?.label ?? v;
        this.render(<div
            event-click={() => this.input.focus()}
            updateItems={Bind.oneWay(() => this.updateItems(this.items))}>
            <input event-blur={() => this.updateValue()}/>
            <label/>
        </div>);

        this.input = this.element.querySelector("input");
        this.labelElement = this.element.querySelector("label");

        const dl = this.datalist = document.createElement("datalist");
        const id =`data-list-select-${dlID++}`;
        document.body.appendChild(dl);
        this.input.setAttribute("list", id);
    }

    updateValue(): any {
        const v = this.input.value;
        const mv = this.map.get(v);
        if (mv !== void 0) {
            this.value = mv;
        }
    }

    updateItems(items: any[]): any {
        this.itemsDisposable?.dispose();
        this.itemsDisposable = null;
        if (!items) {
            this.items = [];
            return;
        }
        this.items = items;
        this.itemsDisposable = AtomBinder.add_CollectionChanged(items, (target, key, index, oldItem) => this.onItemsChanged(target, key, index, oldItem));
        this.deferUpdates();
    }

    onItemsChanged(target: any, key: string, index: number, oldItem: any): void {
        this.deferUpdates();
    }

    deferUpdates() {
        if(this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        this.updateTimeout = setTimeout(() => {
            this.recreateSuggestions();
        }, 10);
    }

    recreateSuggestions() {
        const items = this.items;
        const lp = this.labelPath;
        const vp = this.valuePath;
        const dl = this.datalist;
        dl.innerHTML = "";
        this.map.clear();
        for (const item of items) {
            const o = document.createElement("option");
            o.setAttribute("value", lp(item));
            const l = lp(item);
            const v = vp(item);
            o.text = l;
            o.value = l;
            this.map.set(l, v);
            dl.appendChild(o);
        }
    }

}