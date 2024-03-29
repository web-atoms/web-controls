import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater, { askSuggestion, askSuggestionPopup,
    disposeChildren, Match, MatchAnyCaseInsensitive } from "./AtomRepeater";

import "./styles/drop-down-style";

export default class DropDown<T = any> extends AtomRepeater<T> {

    public "event-selection-changed"?: (e: CustomEvent) => void;

    public "data-alignment"?: "bottom-right" | "bottom-left";

    public disableSearch: boolean;

    @BindableProperty
    public popupSuggestions: boolean;

    @BindableProperty
    public search: string;

    @BindableProperty
    public prompt: string;

    @BindableProperty
    public suggestionPrompt: string;

    @BindableProperty
    public labelPath: (item: T) => string;

    @BindableProperty
    public match: Match<any>;

    @BindableProperty
    public suggestionRenderer: (item: T) => XNode;

    private isPopupOpen = false;

    public updateItems(container?: HTMLElement): void {
        // don't do anything...
    }

    public onPropertyChanged(name: string): void {
        super.onPropertyChanged(name);
        switch (name) {
            case "labelPath":
                this.itemRenderer = (item) => <div text={this.labelPath(item)}/>;
                break;
            case "prompt":
                this.updateClasses();
                break;
        }
    }

    protected preCreate(): void {
        super.preCreate();
        this.disableSearch = false;
        this.prompt = "Select";
        this.popupSuggestions = true;
        this.bindEvent(this.element, "click", (e) => this.openPopup(e));
        this.valuePath = (item: any) => item?.value ?? item;
        this.labelPath = (item: any) => item?.label ?? item;
        this.itemRenderer = (item) => <div text={this.labelPath(item)}/>;
        this.element.dataset.dropDown = "drop-down";
        this.render(<div>
            <div data-white-space="nowrap" text={this.prompt}/>
            <i class="fad fa-caret-circle-down"/>
        </div>);
    }

    protected async openPopup(e: Event) {
        if (this.isPopupOpen) {
            return;
        }
        this.isPopupOpen = true;
        try {
            if (!this.popupSuggestions) {
                const selected = await askSuggestion(
                    this.items,
                    this.suggestionRenderer ?? this.itemRenderer,
                    this.match ?? MatchAnyCaseInsensitive(this.labelPath),
                    { title: this.suggestionPrompt ?? this.prompt });
                this.selectedItem = selected;
                return;
            }

            const selectedItem = await askSuggestionPopup(
                this,
                this.items,
                this.suggestionRenderer ?? this.itemRenderer,
                this.match ?? MatchAnyCaseInsensitive(this.labelPath),
                this.selectedItem);
            if (this.selectedItem !== selectedItem) {
                this.selectedItem = selectedItem;
                this.element.dispatchEvent(new CustomEvent(
                    "selectionChanged",
                    {
                        bubbles: true,
                        detail: selectedItem,
                        cancelable: true
                    }
                ));
            }
        } finally {
            this.isPopupOpen = false;
        }
    }

    protected updateClasses(): void {
        disposeChildren(this, this.element);
        const ir = this.itemRenderer;
        if (!ir) {
            return;
        }
        if (!this.selectedItem) {
            this.render(<div>
                <div data-white-space="nowrap" text={this.prompt}/>
                <i class="fad fa-caret-circle-down"/>
            </div>);
            return;
        }
        const selectedItem = this.selectedItem;
        const index = this.items.indexOf(selectedItem);
        const node = ir(selectedItem, index, this);
        const na = node.attributes ??= {};
        if (!na["data-white-space"]) {
            na["data-white-space"] = "nowrap";
        }
        this.render(<div>
            { node }
            <i class="fad fa-caret-circle-down"/>
        </div>);
    }

}
