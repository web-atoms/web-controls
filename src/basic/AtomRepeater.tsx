import { App } from "@web-atoms/core/dist/App";
import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import EventScope from "@web-atoms/core/dist/core/EventScope";
import { StringHelper } from "@web-atoms/core/dist/core/StringHelper";
import { CancelToken, IDisposable } from "@web-atoms/core/dist/core/types";
import WatchProperty from "@web-atoms/core/dist/core/WatchProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { IDialogOptions, PopupControl, PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import InlinePopup from "./InlinePopup";
import MergeNode from "./MergeNode";
import ItemPath from "./ItemPath";

import "./styles/ui-display-none-style";
import { repeaterPopupCss } from "./styles/popup-style";
import "./styles/suggestion-popup";
import "./styles/repeater-style";
import { ChildEnumerator } from "@web-atoms/core/dist/web/core/AtomUI";
import DataAttributes from "../DataAttributes";

export interface IItemPair<ParentItem = any, ChildItem = any> {
    parent: ParentItem;
    child: ChildItem;
}

const popupCSS = repeaterPopupCss;

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
            const itemIndex = target.getAttribute("data-item-index");
            if (typeof itemIndex !== "undefined") {
                root = target;
                // tslint:disable-next-line: no-bitwise
                index = ~~itemIndex;
            }
        }
        if (eventName === undefined) {
            const itemClickEvent = target.getAttribute("data-click-event");
            if (itemClickEvent) {
                eventName = itemClickEvent.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            }
        }
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

export const MatchCaseInsensitive = (textField: (item) => string = ArrowToString) => {
    return (s: string) => {
        if (!s) {
            return MatchTrue;
        }
        const r = StringHelper.createContainsRegExp(s);
        return (item) => r.test(textField(item));
    };
};

export const MatchAnyCaseInsensitive = (textField: (item) => string = ArrowToString) => {
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
    itemRenderer: (item: T, index: number, repeater: AtomRepeater) => XNode,
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
            options.maxWidth = "90%";
            options.minWidth = "300px";
        }
        if (typeof options.height === "undefined") {
            options.height = "80%";
        }
    }
    return Suggestions.showModal(options);
}

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
    itemRenderer: (item: T, index: number, repeater: AtomRepeater) => XNode,
    match: Match<T>,
    selectedItem: T): Promise<T> {

    const updateSearch = "search" in opener;
    const itemsInOpener = "items" in opener;

    class Suggestions extends InlinePopup {

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
            if (this.opener.search) {
                this.search = this.opener.search;
            }
            if (selectedItem) {
                this.anchorIndex = items.indexOf(selectedItem);
            }
            const disableSearch = (opener as any).disableSearch;
            if (itemsInOpener) {
                this.render(<div data-suggestion-popup="suggestion-popup">
                    {!disableSearch && <input
                        type="search"
                        value={Bind.twoWaysImmediate(() => this.search)}
                        eventKeydown={(e) => this.onKey(e)}
                        autofocus={true}/>}
                    <div class="items">
                        <AtomRepeater
                            class="presenter"
                            selectedItem={Bind.oneWay(() => this.anchorItem)}
                            itemRenderer={itemRenderer}
                            visibilityFilter={Bind.oneWay(() => match(this.search))}
                            eventItemClick={(e) => {
                                this.anchorItem = e.detail;
                                setTimeout(() =>
                                    this.close(e.detail), 100);
                            }}
                            items={Bind.oneWay(() => this.opener.items)}/>
                    </div>
                </div>);
                return;
            }
            this.render(<div data-suggestion-popup="suggestion-popup">
                {!disableSearch && <input
                    type="search"
                    value={Bind.twoWaysImmediate(() => this.search)}
                    eventKeydown={(e) => this.onKey(e)}
                    autofocus={true}/> }
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

    return Suggestions.showControl<T>(opener);

}

export interface ISelectorCheckBox {
    text?: string;
    iconSelected?: string;
    icon?: string;
    [key: string]: any;
}

export function SelectorCheckBox(
    {
        text,
        icon = "far fa-square",
        iconSelected = "fas fa-check-square",
        ... a
    }: ISelectorCheckBox,
    ... nodes: XNode[]) {
    if (text) {
        return <label data-selector="check-box" { ... a}>
        <i class={icon} data-click-event="item-select"/>
        <i class={iconSelected}  data-click-event="item-deselect"/>
            <span data-no-wrap="true" text={text}/>
            { ... nodes }
        </label>;
    }
    return <label data-selector="check-box" { ... a}>
        <i class={icon} data-click-event="item-select"/>
        <i class={iconSelected}  data-click-event="item-deselect"/>
        { ... nodes }
    </label>;
}

class SelectAllControl extends AtomControl {

    @BindableProperty
    public items: any[];

    @BindableProperty
    public selectedItems: any[];

    protected preCreate(): void {
        this.element.setAttribute("data-select-all", "select-all");
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
    while (child && !child.hasAttribute("data-item-index")) {
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

export default class AtomRepeater<T = any> extends AtomControl {

    public static from<TR = AtomRepeater>(element: any): TR {
        while (element) {
            const { atomControl } = element;
            if (atomControl instanceof AtomRepeater) {
                return atomControl as any;
            }
            element = element.parentElement;
        }
    }

    public static itemFromElement(e: HTMLElement, ar: AtomRepeater = this.from(e)) {
        const da = new DataAttributes(e, ar);
        const recreate = da.get("data-recreate");
        const header = da.get("data-header");
        const footer = da.get("data-footer");
        const itemIndex = da.get("data-item-index");
        const itemPath = da.get("data-item-path");
        let clickEvent = da.get("data-click-event") || (header
            ? "headerClick"
            : (footer ? "footerClick" : "itemClick"));
        clickEvent = clickEvent.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        const index = ~~itemIndex;
        const item = ar.items[index];
        let nestedItem = null;
        if (item) {
            if (itemPath || false) {
                // check path...
                nestedItem = ItemPath.get(item, itemPath.trim());
            }
        }
        return {
            recreate,
            header,
            footer,
            itemPath,
            itemIndex,
            item,
            nestedItem,
            clickEvent,
            target: e
        };
    }

    public "event-item-click"?: (e: CustomEvent) => void;
    public "event-item-select"?: (e: CustomEvent) => void;
    public "event-item-deselect"?: (e: CustomEvent) => void;

    public "data-items-updated-event"?: string;
    public "data-selection-updated-event"?: string;

    public "event-items-updated"?: (e: CustomEvent<{ type: string, items: any[] }>) => void;
    public "event-selection-updated"?: (e: CustomEvent<any[]>) => void;

    public bubbleEvents: boolean = true;

    @BindableProperty
    public allowMultipleSelection: boolean;

    @BindableProperty
    public selectOnClick;

    @BindableProperty
    public selectedItems: T[];

    @BindableProperty
    public itemsPresenter: any;

    @BindableProperty
    public items: T[];

    @BindableProperty
    public watch: any;

    @BindableProperty
    public visibilityFilter: (item: T) => boolean;

    @BindableProperty
    public enableFunc: (item: T) => boolean;

    @BindableProperty
    public itemRenderer: (item: T, index: number, repeater: AtomRepeater) => XNode;

    @BindableProperty
    public valuePath: (a: T) => any;

    @BindableProperty
    public comparer: (left: T, right: T) => boolean;

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

    public set refreshEventScope(v: EventScope) {
        this.registerDisposable(v.listen((ce: CustomEvent) => {
            this.refreshItem(ce.detail);
        }));
    }

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
        if (!this.items || !this.items.length) {
            // this will force value based items loader
            AtomBinder.refreshValue(this, "value");
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

    public mergeOnRefresh: boolean;

    protected footerPresenter: HTMLElement;

    protected headerPresenter: HTMLElement;

    private footerElement: HTMLElement;

    private headerElement: HTMLElement;

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
                        default:
                            this.updateItems();
                            break;
                    }
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

    public forEach(action: (item: T, element: HTMLElement) => void, container?: HTMLElement) {
        container ??= this.itemsPresenter ?? this.element;
        const items = this.items;
        let start = getFirstChild(container);
        while (start) {
            const index = start.getAttribute("data-item-index");
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
            const index = node.getAttribute("data-item-index");
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
            const index = element.getAttribute("data-item-index");
            // tslint:disable-next-line: no-bitwise
            const item = items[~~index];
            yield  { item, element };
            element = element.nextElementSibling as HTMLElement;
        }
    }

    public elementAt(index: number, container?: HTMLElement) {
        container ??= this.itemsPresenter ?? this.element;
        const indexText = index.toString();
        const element = ChildEnumerator.find(container, (e) => e.getAttribute("data-item-index") === indexText);
        return element;
    }

    public elementForItem(itemToFind: any, container?: HTMLElement) {
        const index = this.items.indexOf(itemToFind);
        return this.elementAt(index, container);
    }

    public refreshItem(item, fx?: Promise<void> | any, index: number = -1) {
        if (index === -1) {
            index = this.items.indexOf(item);
        }
        if (fx?.then) {
            const finalize = (v) => {
                this.refreshItem(item, v, index);
            };
            fx.then(finalize, finalize);
            return;
        }

        if (fx instanceof MergeNode) {
            // merge items from newly generated node
            this.mergeItem(index, fx);
            return;
        }

        this.updatePartial("set", index, item);
    }

    public mergeItem(index: number, m: MergeNode) {
        const item = this.items[index];
        if (!item) {
            return;
        }

        // @ts-expect-error
        if (m.classes?.[0]?.remove) {
            this.items.removeAt(index);
            return;
        }

        const container = this.itemsPresenter ?? this.element;

        const node = this.itemRenderer(item, index, this);

        const sourceElement = document.createElement("div");
        sourceElement.style.display = "none";
        container.appendChild(sourceElement);
        this.render(node, sourceElement);

        const targetElement = this.elementAt(index);

        for (const iterator of m.classes) {
            if (typeof iterator === "string") {
                const source = sourceElement.querySelectorAll(iterator);
                const target = targetElement.querySelectorAll(iterator);
                for (let i = 0; i < source.length && i < target.length; i++) {
                    const element = source[i];
                    const te = target[i];
                    for (const name of te.getAttributeNames()) {
                        te.removeAttribute(name);
                    }
                    te.innerHTML = element.innerHTML;
                    for (const name of element.getAttributeNames()) {
                        te.setAttribute(name, element.getAttribute(name));
                    }
                }
                continue;
            }

            if (iterator.parent) {
                // parent should be single...
                // and both parent must exist...
                const targetParent = /self|\*/.test(iterator.parent)
                    ? targetElement
                    : targetElement.querySelector(iterator.parent);
                if (!targetParent) {
                    continue;
                }
                for (const i of Array.from(targetElement.querySelectorAll(iterator.replace))) {
                    i.remove();
                }
                for (const i of Array.from(sourceElement.querySelectorAll(iterator.replace))) {
                    targetParent.appendChild(i);
                }
                continue;
            }

            let targetPrevious = targetElement.querySelector(iterator.after);
            for (const i of Array.from(targetElement.querySelectorAll(iterator.replace))) {
                i.remove();
            }
            for (const i of Array.from(sourceElement.querySelectorAll(iterator.replace))) {
                targetPrevious.insertAdjacentElement("afterend", i);
                targetPrevious = i;
            }
        }

        // we need to remove when done...
        // to unbind events... if any...
        this.dispose(sourceElement);
        sourceElement.remove();
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
            ei = ~~start.getAttribute("data-item-index");
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

        const end = this.footerElement?.parentElement === container ? this.footerElement : null;

        if (!isRemove) {
            const en = ir(item, index, this);
            const ea = en.attributes ??= {};
            const v = vp(item);
            const e = document.createElement(ea.for ?? en.name ?? "div") as HTMLElement;
            e.setAttribute("data-item-index",`${index++}`);
            if (si.indexOf(v) !== -1) {
                e.setAttribute("data-selected-item", "true");
            } else {
                e.removeAttribute("data-selected-item");
            }
            if (this.enableDragDrop) {
                updateDragDrop(e);
            }
            if (start) {
                container.insertBefore(e, start);
            } else if(end) {
                container.insertBefore(e, end);
            } else {
                container.appendChild(e);
            }
            this.render(en, e, this.creator || this);
            // start = start.nextElementSibling as HTMLElement;
        }

        while (start) {
            const ci = items[index];
            const cv = vp(ci);
            start.setAttribute("data-item-index",`${index++}`);
            
            if (si.indexOf(cv) !== -1) {
                start.setAttribute("data-selected-item", "true");
            } else {
                start.removeAttribute("data-selected-item");
            }
            start = start.nextElementSibling as HTMLElement;
            if (start?.hasAttribute("data-footer")) {
                break;
            }
        }

        // this.onPropertyChanged("footer");
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

        // this is case when
        // updateItems is fired after
        // repeater is disposed
        if (!container) {
            return;
        }
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
            const index = i++;
            const e = ir(iterator, index, this);
            const ea = e.attributes ??= {};
            const v = vp(iterator);
            const element = document.createElement(ea.for ?? e.name ?? "div");
            element.setAttribute("data-item-index",`${index}`);
            if (si.indexOf(v) !== -1) {
                element.setAttribute("data-selected-item", "true");
            } else {
                element.removeAttribute("data-selected-item");
            }
            this.render(e, element, this.creator || this);
            if (this.enableDragDrop) {
                updateDragDrop(element);
            }
            container.appendChild(element);
        }
        this.onPropertyChanged("footer");
    }

    protected render(node: XNode, e?: any, creator?: any): void {
        if (!this.creator && this !== creator) {
            this.creator = creator;
        }
        this.render = super.render;
        return super.render(node, e, creator);
    }

    protected preCreate() {
        this.mergeOnRefresh = false;
        this.selectOnClick = false;
        this.element.setAttribute("data-click-event", "item-click");
    }

    protected dispatchCustomEvent(type: string, detail: any) {
        if (!this.element) {
            return;
        }
        const eventName = this.element.getAttribute("data-" + type + "-event");
        type = StringHelper.fromHyphenToCamel(eventName ?? type);
        this.element.dispatchEvent(new CustomEvent(type, {
            detail,
            bubbles: eventName !== null,
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
            const index = ~~element.getAttribute("data-item-index");
            const item = items[index];
            const v = vp(item);
            if (si.indexOf(v) !== -1) {
                element.setAttribute("data-selected-item", "true");
            } else {
                element.removeAttribute("data-selected-item");
            }
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
            const index = ~~element.getAttribute("data-item-index");
            const item = items[index];
            if (vf(item)) {
                element.removeAttribute("data-ui-display");
            } else {
                element.setAttribute("data-ui-display", "none");
            }
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
            this[name + "Element"] = null;
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
            this[name + "Element"] = null;
        }

        if (!(item && itemRenderer)) {
            return;
        }

        const node = itemRenderer(item);
        const element = document.createElement(node.attributes?.for ?? node.name ?? "div");
        element.dataset[name] = name;
        this.render(node, element, this.creator || this);
        if (insert) {
            presenter.insertBefore(element, presenter.firstElementChild);
        } else {
            presenter.appendChild(element);
        }
        this[name + "Element"] = element;
    }

    protected dispatchHeaderFooterEvent(eventName, type, recreate, originalTarget) {
        const detail = this[type];
        const ce = new CustomEvent(eventName ?? `${type}Click`, {
            detail,
            bubbles: this.bubbleEvents,
            cancelable: true
        });
        originalTarget.dispatchEvent(ce);
        if (ce.defaultPrevented || !(ce as any).executed) {
            return;
        }
        if (recreate) {
            this.onPropertyChanged(type);
        }
        // const promise = (ce as any).promise;        
        // if (promise) {
        //     promise.then((r) => r instanceof MergeNode && this.refreshItem(item, r));
        // }
    }

    protected dispatchItemEvent(eventName, item, recreate, originalTarget, nestedItem?) {
        const ce = new CustomEvent(eventName ?? "itemClick", {
            detail: nestedItem ?? item,
            bubbles: this.bubbleEvents,
            cancelable: true
        });
        originalTarget.dispatchEvent(ce);
        if (!ce.defaultPrevented) {
            if (this.selectOnClick || eventName === "itemSelect" || eventName === "itemDeselect") {
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
            // if (eventName === "itemSelect") {
            //     if (this.allowMultipleSelection) {
            //         si.add(item);
            //     } else {
            //         si.set(0, item);
            //     }
            // }
            // if (eventName === "itemDeselect") {
            //     si.remove(item);
            // }
        }
        if (ce.defaultPrevented || !(ce as any).executed) {
            return;
        }
        const promise = (ce as any).promise;
        if (recreate) {
            this.refreshItem(item, promise);
            return;
        }
        if (promise) {
            promise.then((r) => r instanceof MergeNode && this.refreshItem(item, r));
        }
    }

    protected dispatchClickEvent(e: MouseEvent, data: any): void {
        const {
            recreate,
            header,
            footer,
            itemIndex,
            itemPath,
            clickEvent,
            item,
            nestedItem
        } = AtomRepeater.itemFromElement(e.target as HTMLElement, this);

        if (itemIndex !== void 0) {
            if (item) {
                if (nestedItem) {
                    this.dispatchItemEvent(clickEvent, item, recreate, e.target, nestedItem);
                    return;
                }
                this.dispatchItemEvent(clickEvent, item, recreate, e.target);
            }
            return;
        }

        if (header) {
            this.dispatchHeaderFooterEvent(clickEvent, header, recreate, e.target);
        }
        if (footer) {
            this.dispatchHeaderFooterEvent(clickEvent, footer, recreate, e.target);
        }
    }
}

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
        placeholder.style.backgroundColor = Colors.lightGray.toString();
        placeholder.style.border = "solid 1px gray";
        placeholder.style.borderRadius = "10px";
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
    let start = placeholder;
    let index = -1;
    while (start) {
        const itemIndex = (start.previousElementSibling as HTMLElement)?.dataset?.itemIndex;
        if (itemIndex !== void 0) {
            // tslint:disable-next-line: no-bitwise
            index = ~~itemIndex;
        }
        if (start.parentElement.atomControl) {
            break;
        }
        start = start.parentElement;
    }
    const targetRepeater = start.parentElement.atomControl as AtomRepeater;
    placeholder.remove();
    hoverItem.placeholder = null;
    repeater.items.remove(item);
    index++;
    const ce = new CustomEvent("itemDropped", { detail: { item, index }});
    if (ce.defaultPrevented) {
        return;
    }
    const { detail } = ce;
    targetRepeater.items.insert(detail.index, detail.item);
});

interface IPoint {
    x: number;
    y: number;
}

const dragOver = (e: DragEvent) => {
    if (!e.dataTransfer) {
        return;
    }
    if (hoverItem) {
        const { placeholder } = hoverItem;
        if (!placeholder) {
            return;
        }
        if (e.target === placeholder) {
            return;
        }
    }
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

        const mp = { x: e.clientX, y: e.clientY };

        const isBefore = (co: DOMRect, n: IPoint) =>
            n.x <= (co.x + (co.width * 0.3)) || n.y <= (co.y + (co.height * 0.3));
        const isAfter = (co: DOMRect, n: IPoint) =>
            n.x >= (co.x + (co.width * 0.7)) || n.y >= (co.y + (co.height * 0.7));

        // const midPoint = (co: DOMRect) => ({ x : co.left + (co.width / 2), y: co.top + (co.height / 2) });

        // const isBetween = (n: IPoint, start: IPoint, end: IPoint) =>
        //     start.x <= n.x && n.x >= end.x || start.y <= n.y && n.y <= end.y;

        // set placeholder...
        const targetBounds = target.getBoundingClientRect();

        if (isAfter(targetBounds, mp)) {
            const next = target.nextElementSibling;
            if (next === placeholder) {
                return;
            }
            placeholder.remove();
            target.insertAdjacentElement("afterend", placeholder);
            return;
        }

        if (isBefore(targetBounds, mp)) {
            const previous = target.previousElementSibling;
            if (previous === placeholder) {
                return;
            }
            placeholder.remove();
            target.insertAdjacentElement("beforebegin", placeholder);
        }

        return;
    }
};

document.body.addEventListener("dragover", dragOver);
document.body.addEventListener("dragenter", dragOver);
