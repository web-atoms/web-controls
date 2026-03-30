import Bind from "@web-atoms/core/dist/core/Bind.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import { askSuggestionPopup, Match, MatchAnyCaseInsensitive } from "./AtomRepeater.js";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty.js";
import { Focusable } from "../Focusable.js";

import "./DropDownInput.global.css";

export default class DropDownInput<T> extends AtomControl {

public "event-selection-changed"?: (e: CustomEvent) => void;

    public items: any[];

    public value: any;

    public label: any;

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
    public autofocus: boolean;

    @BindableProperty
    public itemRenderer: (item: T) => XNode;

    @BindableProperty
    public labelPath: (item: T) => string;

    @BindableProperty
    public valuePath: (item: T) => string;

    @BindableProperty
    public match: Match<any>;

    @BindableProperty
    public suggestionRenderer: (item: T) => XNode;

    @BindableProperty
    selectedItem: any;

    private isPopupOpen: boolean;
    input: HTMLInputElement;
    labelElement: HTMLLabelElement;
    anchorItem: any;

    constructor(app, e = document.createElement("drop-down-input")) {
        super(app, e);
    }

    onPropertyChanged(name: string): void {
        super.onPropertyChanged(name);
        switch(name) {
            case "search":
                if (this.search) {
                    this.openPopup().catch(console.error);
                }
                break;
        }
    }

    protected preCreate(): void {
        this.items = null;
        this.value = null;
        this.selectedItem = null;
        this.labelPath = (x) => (x as any)?.label ?? x;
        this.valuePath = (x) => (x as any)?.value ?? x;
        this.itemRenderer = (x) => <div text={this.labelPath?.(x) ?? x}/>;
        this.search = "";
        this.label = "";
        this.isPopupOpen = false;
        this.disableSearch = true;
        this.render(<div
            event-click={() => this.input.focus()}>
            <input
                autofocus={Bind.oneTime(() => this.autofocus)}
                event-focus={() => this.onFocus()}
                value={Bind.twoWaysImmediate(() => this.search)}/>
            <label text={Bind.oneWay((x) => this.labelPath(this.items?.find((i) => this.valuePath(i) === this.value)))}/>
            <i/>
        </div>);

        this.input = this.element.querySelector("input");
        this.labelElement = this.element.querySelector("label");
    }
    onFocus(): any {

        const value = this.value;
        if (value) {
            const item = this.items.find((i) => this.valuePath?.(i) == value);
            this.input.placeholder = item ? this.labelPath(item) : this.label;
        }
        this.input.value = "";
        this.app.runAsync(() => this.openPopup())
    }

    async openPopup() {
        if(this.isPopupOpen) {
            return;
        }
        this.isPopupOpen = true;
        try {

            let selectedItem = this.items.find((i) => this.value === (this.valuePath?.(i) ?? i));
            this.anchorItem = selectedItem;
            this.selectedItem = selectedItem;

            const newItem = await askSuggestionPopup(
                this as any,
                this.items,
                this.itemRenderer,
                this.match ?? MatchAnyCaseInsensitive(this.labelPath),
                selectedItem);
            if (newItem !== selectedItem) {
                this.selectedItem = newItem;
                this.value = this.valuePath?.(newItem) ?? newItem;
                this.element.dispatchEvent(new CustomEvent(
                    "selectionChanged",
                    {
                        bubbles: true,
                        detail: newItem,
                        cancelable: true
                    }
                ));
                if (newItem) {
                    this.label = this.labelPath(newItem);
                    this.input.placeholder = this.label;
                }
            }
            // Focusable.moveNext(this.input);
        } finally {
            this.isPopupOpen = false;
        } 
    }

}