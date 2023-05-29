import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import { IDisposable } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater, { askSuggestion, askSuggestionPopup } from "./AtomRepeater";

import "./styles/suggestion-style";

export default class AtomSuggestions extends AtomRepeater {

    public eventItemClick: any;

    public "event-item-selected": (ce: CustomEvent) => any;

    @BindableProperty
    public valuePath: any;

    // Title to be displayed on the popup window for e.g. When we click on more in project tags
    @BindableProperty
    public title: string;

    @BindableProperty
    public match: (text) => (item) => boolean;

    @BindableProperty
    public search: string;

    @BindableProperty
    public version: number;

    @BindableProperty
    public suggestionRenderer: (item) => XNode;

    @BindableProperty
    public popupSuggestions: boolean;

    private selectedItemsWatcher: IDisposable;

    private isPopupOpen = false;

    public onPropertyChanged(name: keyof AtomSuggestions): void {
        super.onPropertyChanged(name);
        switch (name) {
            case "selectedItems":
                this.selectedItemsWatcher?.dispose();
                const si = this.selectedItems;
                if (!si) {
                    this.selectedItemsWatcher = null;
                    return;
                }
                const d = si.watch(() => this.version++);
                this.selectedItemsWatcher = this.registerDisposable(d);
                this.version++;
                break;
            case "version":
            case "search":
            case "items":
                    this.updateVisibilityFilter();
                break;
        }
    }

    protected updateVisibilityFilter() {
        const vp = this.valuePath ?? ((item) => item);
        const selectedItems = this.selectedItems ?? [];
        const selectedValues = selectedItems.map(vp);
        const search = this.match(this.search);
        this.visibilityFilter = (item) => {
            const v = vp(item);
            if (!search(item)) {
                return false;
            }
            return selectedValues.length === 0 || selectedValues.indexOf(v) === -1;
        };
    }

    protected create(): void {
        this.version = 1;
        this.search = "";
        this.render(<div data-suggestions="suggestions" eventItemClick={(e) => this.addItem(e.detail)}>
            <span class="header" text={Bind.oneWay(() => this.title)}/>
            <div class="items"></div>
            <div class="more" eventClick={Bind.event(() => this.more())}>More</div>
        </div>);
        this.itemsPresenter = this.element.children[1] as HTMLElement;
        this.updateItems();
    }

    protected async more() {
        if (this.isPopupOpen) {
            return;
        }
        this.isPopupOpen = true;
        try {
            const vf = this.visibilityFilter ?? ((item) => true);
            if (!this.popupSuggestions) {
                const selected = await askSuggestion(
                    this.items.filter(vf),
                    this.suggestionRenderer ?? this.itemRenderer,
                    (text: string) => this.match(text),
                    { title: this.title });
                this.addItem(selected);
                return;
            }

            const selectedItem = await askSuggestionPopup(
                this,
                this.items,
                this.suggestionRenderer ?? this.itemRenderer,
                (text: string) => this.match(text),
                this.selectedItem);
            this.addItem(selectedItem);
        } finally {
            this.isPopupOpen = false;
        }
    }

    protected addItem(selectedItem: any) {
        const ce = new CustomEvent(
            "itemSelected",
            {
                bubbles: true,
                detail: selectedItem,
                cancelable: true
            }
        );
        this.element.dispatchEvent(ce);
        if (!ce.defaultPrevented) {
            const selectedItem = ce.detail;
            const vp = this.valuePath ?? ((i) => i);
            const value = vp(selectedItem);
            if(this.selectedItems) {
                for (const iterator of this.selectedItems) {
                    // eslint-disable-next-line eqeqeq
                    if(vp(iterator) == value) {
                        return;
                    }
                }
            }
            this.selectedItems?.add(selectedItem);
        }
    }
}
