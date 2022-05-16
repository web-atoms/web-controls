import { App } from "@web-atoms/core/dist/App";
import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import { StringHelper } from "@web-atoms/core/dist/core/StringHelper";
import { CancelToken, IDisposable } from "@web-atoms/core/dist/core/types";
import WatchProperty from "@web-atoms/core/dist/core/WatchProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { IDialogOptions, PopupControl, PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

const popupCSS = CSS(StyleRule()
    .height(500)
    .width(300)
    .verticalFlexLayout({ alignItems: "stretch" })
    .child(StyleRule(".items")
        .flexStretch()
        .overflow("auto")
        .child(StyleRule(".presenter")
            .child(StyleRule("*")
                .padding(5)
            )
            .child(StyleRule("[data-selected-item=true]")
                .backgroundColor(Colors.lightGreen)
            )
        )
    )
);

export type IRepeaterItemInfo = [string, AtomRepeater, any, number, HTMLElement] | undefined;

export const getParentRepeaterItem = (target: HTMLElement): IRepeaterItemInfo => {
    let eventName: string;
    let repeater: AtomRepeater;
    let index: number;
    let root: any;
    while (target) {
        const a = target.atomControl;
        if (a !== undefined && a instanceof AtomRepeater) {
            repeater = a;
            break;
        }
        if (index === undefined) {
            const itemIndex = target.dataset.itemIndex;
            if (typeof itemIndex !== "undefined") {
                // tslint:disable-next-line: no-bitwise
                index = ~~itemIndex;
            }
        }
        if (eventName === undefined) {
            const itemClickEvent = target.dataset.clickEvent;
            if (itemClickEvent) {
                eventName = itemClickEvent.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            }
        }
        root = target;
        target = target.parentElement as HTMLElement;
    }

    if (index === void 0 || repeater === void 0) {
        return undefined;
    }

    // tslint:disable-next-line: no-bitwise
    const item = repeater.items[~~index];
    return [eventName, repeater, item, index, root];
};

export type Match<T> = (text: string) => (item: T) => boolean;

export type IAskSuggestion<T> = (items: T[], itemRenderer: (item: T) => XNode, match: Match<T>) => any;

export const MatchTrue = (... a: any[]) => true;

export const MatchFalse = (... a: any[]) => false;

export const ArrowToString = (item) => item.label?.toString() ?? item.toString();

export const MatchCaseInsensitive = (textField?: (item) => string) => {
    textField ??= ArrowToString;
    return (s: string) => {
        if (!s) {
            return MatchTrue;
        }
        const r = StringHelper.createContainsRegExp(s);
        return (item) => r.test(textField(item));
    };
};

export const MatchAnyCaseInsensitive = (textField?: (item) => string) => {
    textField ??= ArrowToString;
    return (s: string) => {
        if (!s) {
            return MatchTrue;
        }
        const r = StringHelper.createContainsAnyWordRegExp(s);
        return (item) =>  r.test( textField(item));
    };
};

export const SameObjectValue = (item) => item;

/**
 * Asks user for selecting item from given suggestions
 * @param items items to display
 * @param itemRenderer render function
 * @param match search match
 * @returns selected item
 */
export function askSuggestion<T>(
    items: T[],
    itemRenderer: (item: T) => XNode,
    match: Match<T>,
    options: IDialogOptions): Promise<T> {
    class Suggestions extends PopupWindow {

        @BindableProperty
        public search: string;

        protected create(): void {
            this.title = options?.title ?? "Select";
            this.render(<div class={popupCSS}>
                <input
                    type="search"
                    value={Bind.twoWaysImmediate(() => this.search)}
                    autofocus={true}/>
                <div class="items">
                    <AtomRepeater
                        class="presenter"
                        itemRenderer={itemRenderer}
                        visibilityFilter={Bind.oneWay(() => match(this.search))}
                        eventItemClick={(e) => {
                            this.close(e.detail);
                        }}
                        items={items}/>
                </div>
            </div>);
        }
    }
    options ??= {};
    if (typeof options.maximize === "undefined") {
        if (typeof options.width === "undefined") {
            options.width = "90%";
        }
        if (typeof options.height === "undefined") {
            options.height = "80%";
        }
    }
    return Suggestions.showModal(options);
}

CSS(StyleRule()
    .height(250)
    .width(300)
    .verticalFlexLayout({ alignItems: "stretch" })
    .child(StyleRule(".items")
        .flexStretch()
        .overflow("auto")
        .child(StyleRule(".presenter")
            .child(StyleRule("*")
                .padding(5)
            )
            .child(StyleRule("[data-selected-item=true]")
                .backgroundColor(Colors.lightGreen)
            )
        )
    )
, "*[data-suggestion-popup=suggestion-popup]");

/**
 * Asks user for selecting item from given suggestions
 * @param items items to display
 * @param itemRenderer render function
 * @param match search match
 * @returns selected item
 */
export function askSuggestionPopup<T>(
    opener: HTMLElement | AtomControl,
    items: T[],
    itemRenderer: (item: T) => XNode,
    match: Match<T>,
    selectedItem: T): Promise<T> {

    const updateSearch = "search" in opener;
    const itemsInOpener = "items" in opener;

    class Suggestions extends PopupControl {

        public anchorItem: T;

        public anchorIndex: number;

        @BindableProperty
        public search: string;

        private opener: any;

        private get items() {
            return itemsInOpener ? this.opener.items : items;
        }

        public onPropertyChanged(name: string): void {
            if (updateSearch && name === "search") {
                (opener as any).search = this.search;
            }
            super.onPropertyChanged(name);
        }

        protected create(): void {
            this.anchorItem = selectedItem;
            this.opener = opener;
            if (selectedItem) {
                this.anchorIndex = items.indexOf(selectedItem);
            }
            if (itemsInOpener) {
                this.render(<div data-suggestion-popup="suggestion-popup">
                    <input
                        type="search"
                        value={Bind.twoWaysImmediate(() => this.search)}
                        eventKeydown={(e) => this.onKey(e)}
                        autofocus={true}/>
                    <div class="items">
                        <AtomRepeater
                            class="presenter"
                            selectedItem={Bind.oneWay(() => this.anchorItem)}
                            itemRenderer={itemRenderer}
                            visibilityFilter={Bind.oneWay(() => match(this.search))}
                            eventItemClick={(e) => {
                                this.close(e.detail);
                            }}
                            items={Bind.oneWay(() => this.opener.items)}/>
                    </div>
                </div>);
                return;
            }
            this.render(<div data-suggestion-popup="suggestion-popup">
                <input
                    type="search"
                    value={Bind.twoWaysImmediate(() => this.search)}
                    eventKeydown={(e) => this.onKey(e)}
                    autofocus={true}/>
                <div class="items">
                    <AtomRepeater
                        class="presenter"
                        selectedItem={Bind.oneWay(() => this.anchorItem)}
                        itemRenderer={itemRenderer}
                        visibilityFilter={Bind.oneWay(() => match(this.search))}
                        scrollToSelection={true}
                        eventItemClick={(e) => {
                            this.close(e.detail);
                        }}
                        items={items}/>
                </div>
            </div>);
        }

        protected onKey(e: KeyboardEvent) {
            const suggested = match ? this.items?.filter(match(this.search)) : this.items;
            switch (e.key) {
                case "Enter":
                    // selection mode...
                    const anchorItem = this.anchorItem;
                    if (!anchorItem) {
                        return;
                    }
                    this.anchorIndex = 0;
                    this.close(anchorItem);
                    this.anchorItem = null;
                    this.search = "";
                    break;
                case "ArrowDown":
                    if (suggested) {
                        if (!this.anchorItem) {
                            this.anchorIndex = 0;
                        } else {
                            if (this.anchorIndex < suggested.length - 1) {
                                this.anchorIndex++;
                            }
                        }
                        this.anchorItem = suggested[this.anchorIndex];
                    }
                    break;
                case "ArrowUp":
                        if (suggested) {
                            if (!this.anchorItem) {
                                return;
                            }
                            if (this.anchorIndex) {
                                this.anchorIndex--;
                            }
                            this.anchorItem = suggested[this.anchorIndex];
                        }
                        break;
                }
        }
    }

    return Suggestions.showControl(opener);

}

export interface ISelectorCheckBox {
    text?: string;
    iconSelected?: string;
    icon?: string;
    [key: string]: any;
}

CSS(StyleRule()
    .nested(StyleRule("i[data-click-event]")
        .padding(5)
    )
    .nested(StyleRule("[data-no-wrap=true]")
        .whiteSpace("nowrap")
    )
, "*[data-selected-item]");

CSS(StyleRule()
    .nested(StyleRule("i[data-click-event=item-select]")
        .padding(5)
    )
    .displayNone(" i[data-click-event=item-select]")
, "*[data-selected-item=true]");

CSS(StyleRule()
    .displayNone(" i[data-click-event=item-deselect]")
, "*[data-selected-item=false]");

export function SelectorCheckBox(
    {
        text,
        icon = "far fa-square",
        iconSelected = "fas fa-check-square",
        ... a
    }: ISelectorCheckBox,
    ... nodes: XNode[]) {
    if (text) {
        return <label>
        <i class={icon} data-click-event="item-select"/>
        <i class={iconSelected}  data-click-event="item-deselect"/>
            <span data-no-wrap="true" text={text}/>
            { ... nodes }
        </label>;
    }
    return <label>
        <i class={icon} data-click-event="item-select"/>
        <i class={iconSelected}  data-click-event="item-deselect"/>
        { ... nodes }
    </label>;
}

CSS(StyleRule()
    .flexLayout({ alignItems: "center", justifyContent: "flex-start"})
    .margin(0)
    .nested(StyleRule("i[data-ui-type]")
        .padding(5)
    )
    .nested(StyleRule("[data-no-wrap=true]")
        .whiteSpace("nowrap")
    )
    .displayNone("[data-is-selected=true] i[data-ui-type=item-select]")
    .displayNone("[data-is-selected=false] i[data-ui-type=item-deselect]")
, "*[data-select-all=select-all]");

class SelectAllControl extends AtomControl {

    @BindableProperty
    public items: any[];

    @BindableProperty
    public selectedItems: any[];

    protected preCreate(): void {
        this.element.dataset.selectAll = "select-all";
        this.items = [];
        this.selectedItems = [];
        this.render(<SelectAllControl
            data-is-selected={Bind.oneWay(() => this.items.length > 0
                && this.items.length === this.selectedItems.length, false)}
        />);
        this.bindEvent(this.element, "click", () => {
            const si = this.selectedItems;
            const items = this.items;
            if (!si) {
                return;
            }
            if (!items) {
                return;
            }
            if (items.length === 0) {
                return;
            }
            if (items.length === si.length) {
                si.clear();
            } else {
                si.length = 0;
                si.push( ... items);
                si.refresh();
            }
        });
    }

}

export interface ISelectAll extends ISelectorCheckBox {
    items: any[];
    selectedItems: any[];
}

export function SelectAll(
    {
        text = "Select All",
        icon = "far fa-square",
        iconSelected = "fas fa-check-square",
        ... a
    }: ISelectAll,
    ... nodes: XNode[]) {
    if (text) {
        return <SelectAllControl
            for="label" { ... a}>
            <i class={icon} data-ui-type="item-select"/>
            <i class={iconSelected} data-ui-type="item-deselect"/>
            <span data-no-wrap="true" text={text}/>
        </SelectAllControl>;
    }
    return <SelectAllControl for="label" { ... a}>
        <i class={icon} data-ui-type="item-select"/>
        <i class={iconSelected} data-ui-type="item-deselect"/>
        { ... nodes }
    </SelectAllControl>;
}

export function disposeChildren(owner: AtomControl, e: HTMLElement) {
    if (!e) {
        return;
    }
    let s = e.firstElementChild;
    while (s) {
        const c = s as any;
        s = s.nextElementSibling as HTMLElement;
        const ac = c.atomControl;
        if (ac) {
            ac.dispose();
            continue;
        }
        disposeChildren(owner, c);
        owner.unbind(c);
        owner.unbindEvent(c);
    }
    e.innerHTML = ""; // this should remove all elements... fast.. probably??
}

export function disposeChild(owner: AtomControl, e: HTMLElement) {
    const ac = e.atomControl;
    if (ac) {
        ac.dispose();
        return;
    }
    disposeChildren(owner, e);
    owner.unbind(e);
    owner.unbindEvent(e);
    e.remove();
}

export function defaultComparer<T>(left: T , right: T) {
    if (left && right) {
        if (left instanceof Date) {
            if (right instanceof Date) {
                return left.getTime() === right.getTime();
            }
            return false;
        }
    }
    return left === right;
}

const getFirstChild = (container: HTMLElement) => {
    let child = container.firstElementChild as HTMLElement;
    while (child && child.dataset.itemIndex === void 0) {
        child = child.nextElementSibling as HTMLElement;
    }
    return child;
};

function updateDragDrop(e: HTMLElement, force: boolean = false) {
    if (!e) {
        return;
    }
    if (force) {
        e.draggable = false;
    } else {
        force = e.draggable;
    }
    e = e.firstElementChild as HTMLElement;
    while (e) {
        updateDragDrop(e, force);
        e = e.nextElementSibling as HTMLElement;
    }
}

export default class AtomRepeater extends AtomControl {

    public "event-item-click"?: (e: CustomEvent) => void;
    public "event-item-select"?: (e: CustomEvent) => void;
    public "event-item-deselect"?: (e: CustomEvent) => void;
    public "event-items-updated"?: (e: CustomEvent<{ type: string, items: any[] }>) => void;
    public "event-selection-updated"?: (e: CustomEvent<any[]>) => void;

    public bubbleEvents: boolean = true;

    @BindableProperty
    public allowMultipleSelection: boolean;

    @BindableProperty
    public selectedItems: any[];

    @BindableProperty
    public itemsPresenter: any;

    @BindableProperty
    public items: any[];

    @BindableProperty
    public watch: any;

    @BindableProperty
    public visibilityFilter: (item: any) => boolean;

    @BindableProperty
    public enableFunc: (item: any) => boolean;

    @BindableProperty
    public itemRenderer: (item) => XNode;

    @BindableProperty
    public valuePath: (a) => any;

    @BindableProperty
    public comparer: (left, right) => boolean;

    @BindableProperty
    public deferUpdates: boolean;

    @BindableProperty
    public header: any;

    @BindableProperty
    public headerRenderer: any;

    @BindableProperty
    public footer: any;

    @BindableProperty
    public footerRenderer: any;

    @BindableProperty
    public enableDragDrop: any;

    public itemTag: string;

    @WatchProperty
    public get allSelected() {
        const selectedItems = this.selectedItems;
        const items = this.items;
        if (!(items && selectedItems)) {
            return false;
        }
        return items.length && items.length === selectedItems.length;
    }

    public get value() {
        if (this.initialValue !== undefined) {
            return this.initialValue;
        }
        const sp = this.selectedItem;
        if (sp === undefined) {
            return sp;
        }
        const vp = this.valuePath ?? SameObjectValue;
        return vp(sp);
    }

    public set value(v) {
        this.initialValue = v;
        if (!this.items) {
            return;
        }
        const vp = this.valuePath ?? SameObjectValue;
        const c = this.comparer ?? defaultComparer;
        const selectedItem = this.items.find((item) => c(vp(item), v));
        this.selectedItem = selectedItem;
        delete this.initialValue;
    }

    public get selectedItem() {
        return this.selectedItems?.[0];
    }

    public set selectedItem(value) {
        const si = this.selectedItems ??= [];
        const first = si[0];
        if (value === first) {
            return;
        }
        si.set(0, value);
    }

    public scrollToSelection: boolean;

    protected footerPresenter: HTMLElement;

    protected headerPresenter: HTMLElement;

    private initialValue: any;

    private itemsDisposable: IDisposable;

    private selectedItemsDisposable: IDisposable;

    private deferredUpdateId: any;

    private bringIntoViewId: any;

    public onPropertyChanged(name: string): void {
        switch (name) {
            case "items":
                this.itemsDisposable?.dispose();
                const items = this.items;
                const d = items?.watch((target, type, index, item) => {
                    switch (type) {
                        case "add":
                        case "remove":
                        case "set":
                            this.updatePartial(type, index, item);
                            break;
                    }
                    this.updateItems();
                    this.dispatchCustomEvent("items-updated", { type, items, index });
                    AtomBinder.refreshValue(this, "selectedItem");
                    AtomBinder.refreshValue(this, "value");
                });
                if (d) {
                    this.itemsDisposable = this.registerDisposable(d);
                }
                const iv = this.initialValue;
                if (iv) {
                    this.value = iv;
                }
                this.updateItems();
                this.dispatchCustomEvent("items-updated", { type: "reset", items, index : 0 });
                if (this.scrollToSelection) {
                    this.bringSelectionIntoView();
                }
                break;
            case "selectedItems":
                this.selectedItemsDisposable?.dispose();
                const selectedItems = this.selectedItems;
                const sd = selectedItems?.watch(() => {
                    this.updateClasses();
                    if (this.scrollToSelection) {
                        this.bringSelectionIntoView();
                    }
                    if (this.selectedItem) {
                        delete this.initialValue;
                    }
                    AtomBinder.refreshValue(this, "selectedItem");
                    AtomBinder.refreshValue(this, "value");
                    AtomBinder.refreshValue(this, "allSelected");
                    this.dispatchCustomEvent("selection-updated", selectedItems);
                });
                if (sd) {
                    this.selectedItemsDisposable = this.registerDisposable(sd);
                }
                this.updateClasses();
                this.dispatchCustomEvent("selection-updated", selectedItems);
                AtomBinder.refreshValue(this, "allSelected");
                break;
            case "itemRenderer":
            case "watch":
                this.updateItems();
                break;
            case "visibilityFilter":
                this.updateVisibility();
                break;
            case "header":
            case "headerRenderer":
                this.updateHeaderFooter("header", this.headerPresenter, this.header, this.headerRenderer, true);
                break;
            case "footer":
            case "footerRenderer":
                this.updateHeaderFooter("footer", this.footerPresenter, this.footer, this.footerRenderer);
                break;
        }
    }

    public bringSelectionIntoView(force?: boolean) {
        if (force) {
            const selection = this.selectedItem;
            if (selection) {
                const element = this.elementForItem(selection);
                element?.scrollIntoView();
            }
            return;
        }
        if (this.bringIntoViewId) {
            clearTimeout(this.bringIntoViewId);
        }
        this.bringIntoViewId = setTimeout(() => {
            clearTimeout(this.bringIntoViewId);
            this.bringIntoViewId = undefined;
            this.bringSelectionIntoView(true);
        }, 100);
    }

    public forEach<T>(action: (item: T, element: HTMLElement) => void, container?: HTMLElement) {
        container ??= this.itemsPresenter ?? this.element;
        const items = this.items;
        let start = getFirstChild(container);
        while (start) {
            const index = start.dataset.itemIndex;
            // tslint:disable-next-line: no-bitwise
            const item = items[~~index];
            action(item, start);
            start = start.nextElementSibling as HTMLElement;
        }
    }

    public *any(fx?: (item) => boolean, itemSelector?: string,  container?: HTMLElement) {
        container ??= this.itemsPresenter ?? this.element;
        const items = this.items;
        let node = getFirstChild(container);
        while (node) {
            const index = node.dataset.itemIndex;
            // tslint:disable-next-line: no-bitwise
            const item = items[~~index];
            let element = node;
            if (itemSelector) {
                element = element.querySelector(itemSelector);
            }
            const ie = { item, element };
            if (fx) {
                if (fx(item)) {
                    yield ie;
                }
                continue;
            }
            yield  ie;
            node = node.nextElementSibling as HTMLElement;
        }
    }

    public *all(container?: HTMLElement) {
        container ??= this.itemsPresenter ?? this.element;
        const items = this.items;
        let element = getFirstChild(container);
        while (element) {
            const index = element.dataset.itemIndex;
            // tslint:disable-next-line: no-bitwise
            const item = items[~~index];
            yield  { item, element };
            element = element.nextElementSibling as HTMLElement;
        }
    }

    public elementForItem(itemToFind: any, container?: HTMLElement) {
        container ??= this.itemsPresenter ?? this.element;
        const items = this.items;
        let element = getFirstChild(container);
        while (element) {
            const index = element.dataset.itemIndex;
            // tslint:disable-next-line: no-bitwise
            const item = items[~~index];
            if (item === itemToFind) {
                return element;
            }
            element = element.nextElementSibling as HTMLElement;
        }
    }

    public refreshItem(item, fx?: Promise<void> | any, index: number = -1) {
        if (index === -1) {
            index = this.items.indexOf(item);
        }
        if (fx?.then) {
            const finalize = () => {
                this.refreshItem(item, undefined, index);
            };
            fx.then(finalize, finalize);
            return;
        }
        this.updatePartial("set", index, item);
    }

    public updatePartial(key, index, item, container?: HTMLElement) {

        const items = this.items;
        if (!items) {
            return;
        }

        const ir = this.itemRenderer;
        if (!ir) {
            return;
        }

        container ??= this.itemsPresenter ?? this.element;
        let start = getFirstChild(container);
        let ei;

        while (start) {
            // tslint:disable-next-line: no-bitwise
            ei = ~~start.dataset.itemIndex;
            if (ei === index) {
                break;
            }
            start = start.nextElementSibling as HTMLElement;
        }

        if (key !== "add" && !start) {
            return;
        }

        const vp = this.valuePath ?? ((it) => it);
        const si = (this.selectedItems ?? []).map(vp);

        const isRemove = key === "remove";

        if (isRemove || key  === "set") {
            const current = start;
            start = start.nextElementSibling as HTMLElement;
            const ac = current.atomControl;
            if (ac) {
                ac.dispose();
            } else {
                this.unbind(current);
                this.unbindEvent(current);
            }
            current.remove();
        }

        if (!isRemove) {
            const en = ir(item);
            const ea = en.attributes ??= {};
            const v = vp(item);
            const e = document.createElement(ea.for ?? en.name ?? "div");
            e.dataset.itemIndex = (index++).toString();
            e.dataset.selectedItem = si.indexOf(v) !== -1 ? "true" : "false";
            if (this.enableDragDrop) {
                updateDragDrop(e);
            }
            if (start) {
                container.insertBefore(e, start);
            } else {
                container.appendChild(e);
            }
            this.render(en, e, this);
            // start = start.nextElementSibling as HTMLElement;
        }

        while (start) {
            const ci = items[index];
            const cv = vp(ci);
            start.dataset.itemIndex = (index++).toString();
            start.dataset.selectedItem = si.indexOf(cv) !== -1
                ? "true"
                : "false";
            start = start.nextElementSibling as HTMLElement;
        }
    }

    public updateItems(container?: HTMLElement, force?: boolean) {
        if (this.deferUpdates && !force) {
            if (this.deferredUpdateId) {
                return;
            }
            this.deferredUpdateId = setTimeout(() => {
                this.deferredUpdateId = 0;
                this.updateItems(container, true);
            }, 1);
            return;
        }
        container ??= this.itemsPresenter ?? this.element;
        disposeChildren(this, container);

        this.onPropertyChanged("header");

        const ir = this.itemRenderer;
        if (!ir) {
            this.onPropertyChanged("footer");
            return;
        }
        const items = this.items;
        if (!items) {
            this.onPropertyChanged("footer");
            return;
        }

        const vp = this.valuePath ?? ((it) => it);
        const si = (this.selectedItems ?? []).map(vp);
        let i = 0;
        for (const iterator of items) {
            const e = ir(iterator);
            const ea = e.attributes ??= {};
            const v = vp(iterator);
            const element = document.createElement(ea.for ?? e.name ?? "div");
            element.dataset.itemIndex = (i++).toString();
            element.dataset.selectedItem = si.indexOf(v) !== -1 ? "true" : "false";
            this.render(e, element, this);
            if (this.enableDragDrop) {
                updateDragDrop(element);
            }
            container.appendChild(element);
        }
        this.onPropertyChanged("footer");
    }

    protected dispatchCustomEvent(type: string, detail: any) {
        type = StringHelper.fromHyphenToCamel(type);
        this.element?.dispatchEvent(new CustomEvent(type, {
            detail,
            bubbles: false,
            cancelable: true
        }));
    }

    protected updateClasses() {
        const container = this.itemsPresenter ?? this.element;
        const items = this.items;
        let element = getFirstChild(container);
        const vp = this.valuePath ?? ((i) => i);
        const si = (this.selectedItems ?? []).map(vp);
        while (element) {
            // tslint:disable-next-line: no-bitwise
            const index = ~~element.dataset.itemIndex;
            const item = items[index];
            const v = vp(item);
            element.dataset.selectedItem = si.indexOf(v) !== -1
                ? "true"
                : "false";
            element = element.nextElementSibling as HTMLElement;
        }

    }

    protected updateVisibility() {
        const container = this.itemsPresenter ?? this.element;
        const items = this.items;
        let element = container.firstElementChild as HTMLElement;
        const vf = this.visibilityFilter ?? MatchTrue;
        while (element) {
            // tslint:disable-next-line: no-bitwise
            const index = ~~element.dataset.itemIndex;
            const item = items[index];
            element.style.display = vf(item) ? "" : "none";
            element = element.nextElementSibling as HTMLElement;
        }
    }

    protected updateHeaderFooter(
        name,
        presenter: HTMLElement,
        item: any,
        itemRenderer: (i) => XNode,
        insert?: boolean)  {

        presenter ??= this.itemsPresenter ??= this.element;

        if (!presenter) {
            return;
        }

        let current: HTMLElement;
        // remove only the header...
        if (insert) {
            current = presenter.firstElementChild as HTMLElement;
            while (current && current.dataset[name] !== name) {
                current = current.nextElementSibling as HTMLElement;
            }
        } else {
            current = presenter.lastElementChild as HTMLElement;
            while (current && current.dataset[name] !== name) {
                current = current.previousElementSibling as HTMLElement;
            }
        }

        if (current) {
            disposeChild(this, current);
        }

        if (!(item && itemRenderer)) {
            return;
        }

        const node = itemRenderer(item);
        const element = document.createElement(node.attributes?.for ?? node.name ?? "div");
        element.dataset[name] = name;
        this.render(node, element, this);
        if (insert) {
            presenter.insertBefore(element, presenter.firstElementChild);
        } else {
            presenter.appendChild(element);
        }
    }

    protected dispatchHeaderFooterEvent(eventName, type, originalTarget) {
        const detail = this[type];
        const ce = new CustomEvent(eventName ?? `${type}Click`, {
            detail,
            bubbles: this.bubbleEvents,
            cancelable: true
        });
        originalTarget.dispatchEvent(ce);
        if (!ce.defaultPrevented) {
            this.onPropertyChanged(type);
        }
    }

    protected dispatchItemEvent(eventName, item, recreate, originalTarget) {
        const ce = new CustomEvent(eventName ?? "itemClick", {
            detail: item,
            bubbles: this.bubbleEvents,
            cancelable: true
        });
        originalTarget.dispatchEvent(ce);
        if (recreate && (ce as any).executed && !ce.defaultPrevented) {
            this.refreshItem(item, (ce as any).promise);
        }
    }
}

function onElementClick(e: Event) {
    let target = e.target as HTMLElement;
    const originalTarget = target;
    let eventName;
    let repeater: AtomRepeater;
    let index;
    let type;
    let recreate;
    while (target) {
        const a = target.atomControl;
        if (a !== undefined && a instanceof AtomRepeater) {
            repeater = a;
            break;
        }
        if (index === undefined) {
            const itemIndex = target.dataset.itemIndex;
            if (itemIndex !== void 0) {
                // tslint:disable-next-line: no-bitwise
                index = ~~itemIndex;
            }
        }
        if (type === undefined) {
            const itemType = target.dataset.header ?? target.dataset.footer;
            if (itemType !== void 0) {
                type = itemType;
            }
        }
        if (eventName === undefined) {
            const itemClickEvent = target.dataset.clickEvent;
            if (itemClickEvent) {
                eventName = itemClickEvent.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            }
        }
        if (recreate === undefined) {
            recreate = target.dataset.recreate;
        }
        target = target.parentElement as HTMLElement;
    }

    if (index === undefined) {
        if (type !== undefined) {
            (repeater as any).dispatchHeaderFooterEvent(eventName, type, originalTarget);
        }
        return;
    }

    // tslint:disable-next-line: no-bitwise
    const item = repeater.items[~~index];
    if (eventName === "itemSelect" || eventName === "itemDeselect") {
        const si = repeater.selectedItems ??= [];
        if (si) {
            index = si.indexOf(item);
            if (index === -1) {
                if (repeater.allowMultipleSelection) {
                    si.add(item);
                } else {
                    si.set(0, item);
                }
            } else {
                si.removeAt(index);
            }
        }
    }
    if (item) {
        (repeater as any).dispatchItemEvent(eventName, item, recreate, originalTarget);
    }
}

document.body.addEventListener("click", onElementClick, true);

let hoverItem = {
    repeater: null,
    target: null as HTMLElement,
    item: null,
    placeholder: null as HTMLElement
};

document.body.addEventListener("dragstart", (e) => {
    const { target } = e as any;
    if (target.draggable) {
        const ri = getParentRepeaterItem(target);
        if (!ri) {
            return;
        }
        const [type, repeater, item, index] = ri;
        if (!repeater || !repeater.enableDragDrop) {
            return;
        }
        const placeholder = document.createElement("div");
        placeholder.style.width = target.offsetWidth + "px";
        placeholder.style.height = target.offsetHeight + "px";
        hoverItem = {
            repeater,
            target,
            item,
            placeholder,
        };
        e.dataTransfer.dropEffect = "move";
        setTimeout(() => {
            target.style.display = "none";
            (target.parentElement as HTMLElement).insertBefore(placeholder, target);
        }, 0);
    }
});

document.body.addEventListener("dragend", (e) => {
    if (!(hoverItem?.placeholder)) {
        return;
    }
    const {
        item,
        placeholder,
        repeater
    } = hoverItem;
    const targetRepeater = placeholder.parentElement.atomControl as AtomRepeater;
    const previous = placeholder.previousElementSibling as HTMLElement;
    let index = 0;
    if (previous) {
        // tslint:disable-next-line: no-bitwise
        index = (~~previous.dataset.itemIndex);
    }
    placeholder.remove();
    hoverItem.placeholder = null;
    repeater.items.remove(item);
    targetRepeater.items.insert(index, item);
});

interface IPoint {
    x: number;
    y: number;
}

const dragOver = (e: DragEvent) => {
    const ri = getParentRepeaterItem(e.target as HTMLElement);
    if (!ri) {
        return;
    }
    const [type, repeater, item, index, target] = ri;
    if (!repeater) {
        return;
    }
    if (hoverItem) {
        const { placeholder } = hoverItem;
        e.preventDefault();
        if (target === placeholder) {
            return;
        }

        const mp = { x: e.clientX, y: e.clientY };

        const midPoint = (co: DOMRect) => ({ x : co.left + (co.width / 2), y: co.top + (co.height / 2) });

        const isBetween = (n: IPoint, start: IPoint, end: IPoint) =>
            start.x <= n.x && n.x >= end.x || start.y <= n.y && n.y <= end.y;

        // set placeholder...
        const rootMP = midPoint(target.getBoundingClientRect());

        // get previous...
        const previous = target.previousElementSibling as HTMLElement;
        if (previous && previous !== placeholder) {
            const pmp  = midPoint(previous.getBoundingClientRect());
            if (isBetween(mp, pmp, rootMP)) {
                // inert before...
                placeholder.remove();
                target.insertAdjacentElement("beforebegin", placeholder);
                return;
            }
        }

        const next = target.nextElementSibling as HTMLElement;
        if (next && next !== placeholder) {
            const npm = midPoint(next.getBoundingClientRect());
            if (isBetween(mp, rootMP, npm)) {
                placeholder.remove();
                target.insertAdjacentElement("afterend", placeholder);
                return;
            }
        }

        if (!previous)  {
            placeholder.remove();
            target.insertAdjacentElement("beforebegin", placeholder);
            return;
        }
        placeholder.remove();
        target.insertAdjacentElement("afterend", placeholder);
        return;
    }
};

document.body.addEventListener("dragover", dragOver);
document.body.addEventListener("dragenter", dragOver);
