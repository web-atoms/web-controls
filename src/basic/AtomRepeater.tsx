import { App } from "@web-atoms/core/dist/App";
import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import { CancelToken, IDisposable } from "@web-atoms/core/dist/core/types";
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

let refreshId = 1;

export const getParentRepeaterItem = (target: HTMLElement): [string, AtomRepeater, any, number] | undefined => {
    let eventName: string;
    let repeater: AtomRepeater;
    let index: number;
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
        target = target.parentElement as HTMLElement;
    }

    if (index === undefined) {
        return undefined;
    }

    // tslint:disable-next-line: no-bitwise
    const item = repeater.items[~~index];
    return [eventName, repeater, item, index];
};

export type Match<T> = (text: string) => (item: T) => boolean;

export type IAskSuggestion<T> = (items: T[], itemRenderer: (item: T) => XNode, match: Match<T>) => any;

export const MatchTrue = (... a: any[]) => true;

export const MatchFalse = (... a: any[]) => false;

export const ArrowToString = (item) => item.label?.toString() ?? item.toString();

export const MatchCaseInsensitive = (textField?: (item) => string) => {
    textField ??= ArrowToString;
    return (s: string) => {
        s = s.toLowerCase();
        return (item) => textField(item)?.toLowerCase()?.includes(s);
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

    class Suggestions extends PopupControl {

        public anchorItem: T;

        public anchorIndex: number;

        @BindableProperty
        public search: string;

        protected create(): void {
            this.anchorItem = selectedItem;
            if (selectedItem) {
                this.anchorIndex = items.indexOf(selectedItem);
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
                        eventItemClick={(e) => {
                            this.close(e.detail);
                        }}
                        items={items}/>
                </div>
            </div>);
        }

        protected onKey(e: KeyboardEvent) {
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
                    if (items) {
                        if (!this.anchorItem) {
                            this.anchorIndex = 0;
                        } else {
                            if (this.anchorIndex < items.length - 1) {
                                this.anchorIndex++;
                            }
                        }
                        this.anchorItem = items[this.anchorIndex];
                    }
                    break;
                case "ArrowUp":
                        if (items) {
                            if (!this.anchorItem) {
                                return;
                            }
                            if (this.anchorIndex) {
                                this.anchorIndex--;
                            }
                            this.anchorItem = items[this.anchorIndex];
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
                si.addAll(items);
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

export default class AtomRepeater extends AtomControl {

    public "event-item-click"?: (e: CustomEvent) => void;
    public "event-item-select"?: (e: CustomEvent) => void;
    public "event-item-deselect"?: (e: CustomEvent) => void;

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
        si[0] = value;
        si.refresh();
    }

    private initialValue: any;

    private itemsDisposable: IDisposable;

    private selectedItemsDisposable: IDisposable;

    public onPropertyChanged(name: string): void {
        switch (name) {
            case "items":
                this.itemsDisposable?.dispose();
                const items = this.items;
                const d = items?.watch((target, key, index, item) => {
                    switch (key) {
                        case "add":
                        case "remove":
                            this.updatePartial(key, index, item);
                            break;
                    }
                    this.updateItems();
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
                break;
            case "selectedItems":
                this.selectedItemsDisposable?.dispose();
                const selectedItems = this.selectedItems;
                const sd = selectedItems?.watch(() => {
                    this.updateClasses();
                    AtomBinder.refreshValue(this, "selectedItem");
                    AtomBinder.refreshValue(this, "value");
                });
                if (sd) {
                    this.selectedItemsDisposable = this.registerDisposable(sd);
                }
                this.updateClasses();
                break;
            case "itemRenderer":
            case "watch":
                this.updateItems();
                break;
            case "visibilityFilter":
                this.updateVisibility();
                break;
        }
    }

    public forEach<T>(action: (item: T, element: HTMLElement) => void, container?: HTMLElement) {
        container ??= this.itemsPresenter ?? this.element;
        const items = this.items;
        let start = container.firstElementChild as HTMLElement;
        while (start) {
            // tslint:disable-next-line: no-bitwise
            const index = ~~start.dataset.itemIndex;
            const item = items[index];
            action(item, start);
            start = start.nextElementSibling as HTMLElement;
        }
    }

    public *any(fx?: (item) => boolean, itemSelector?: string,  container?: HTMLElement) {
        container ??= this.itemsPresenter ?? this.element;
        const items = this.items;
        let node = container.firstElementChild as HTMLElement;
        while (node) {
            // tslint:disable-next-line: no-bitwise
            const index = ~~node.dataset.itemIndex;
            const item = items[index];
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
        let element = container.firstElementChild as HTMLElement;
        while (element) {
            // tslint:disable-next-line: no-bitwise
            const index = ~~element.dataset.itemIndex;
            const item = items[index];
            yield  { item, element };
            element = element.nextElementSibling as HTMLElement;
        }
    }

    public refreshItem(item, fx?: Promise<void> | any) {
        if (fx?.then) {
            const id = refreshId++;
            this.element.dispatchEvent(new CustomEvent("refreshLockBegin", { detail: { id }, bubbles: true }));
            const finalize = () => {
                this.refreshItem(item);
                this.element.dispatchEvent(new CustomEvent("refreshLockEnd", { detail: { id }, bubbles: true}));
            };
            fx.then(finalize, finalize);
            return;
        }
        const index = this.items.indexOf(item);
        this.updatePartial("remove", index, item);
        this.updatePartial("add", index, item);
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
        let start = container.firstElementChild as HTMLElement;
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

        if (key === "remove") {
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
        } else {
            const en = ir(item);
            const ea = en.attributes ??= {};
            const v = vp(item);
            const e = document.createElement(ea.for ?? ea.name ?? "div");
            e.dataset.itemIndex = (index++).toString();
            e.dataset.selectedItem = si.indexOf(v) !== -1 ? "true" : "false";
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

    public updateItems(container?: HTMLElement) {
        container ??= this.itemsPresenter ?? this.element;
        disposeChildren(this, container);
        const ir = this.itemRenderer;
        if (!ir) {
            return;
        }
        const items = this.items;
        if (!items) {
            return;
        }

        const vp = this.valuePath ?? ((it) => it);
        const si = (this.selectedItems ?? []).map(vp);
        let i = 0;
        for (const iterator of items) {
            const e = ir(iterator);
            const ea = e.attributes ??= {};
            const v = vp(iterator);
            ea["data-item-index"] = (i++).toString();
            ea["data-selected-item"] = si.indexOf(v) !== -1
            ? "true"
            : "false";
            this.render(<div>
                { e }
            </div>, container, this);
        }

    }

    protected updateClasses() {
        const container = this.itemsPresenter ?? this.element;
        const items = this.items;
        let element = container.firstElementChild as HTMLElement;
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

}

function onElementClick(e: Event) {
    let target = e.target as HTMLElement;
    const originalTarget = target;
    let eventName;
    let repeater;
    let index;
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
        target = target.parentElement as HTMLElement;
    }

    if (index === undefined) {
        return;
    }

    // tslint:disable-next-line: no-bitwise
    const item = repeater.items[~~index];
    if (eventName === "itemSelect" || eventName === "itemDeselect") {
        const si = repeater.selectedItems;
        if (si) {
            index = si.indexOf(item);
            if (index === -1) {
                if (repeater.allowMultipleSelection) {
                    si.add(item);
                } else {
                    si[0] = item;
                    si.refresh();
                }
            } else {
                si.removeAt(index);
            }
        }
    }
    if (item) {
        const ce = new CustomEvent(eventName ?? "itemClick", {
            detail: item,
            bubbles: repeater.bubbleEvents
        });
        originalTarget.dispatchEvent(ce);
    }
}

document.body.addEventListener("click", onElementClick, true);
