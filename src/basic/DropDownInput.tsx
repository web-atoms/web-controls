import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import Bind from "@web-atoms/core/dist/core/Bind";
import { IDisposable } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { IDialogOptions } from "@web-atoms/core/dist/web/services/PopupService";
import PopupWindow from "@web-atoms/core/dist/web/services/PopupWindow";
import AtomRepeater, { askSuggestionPopup, Match, MatchAnyCaseInsensitive } from "./AtomRepeater";
import AtomPopover from "./elements/AtomPopover";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";

let dlID = 1;

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
    public itemRenderer: (item: T) => XNode;

    @BindableProperty
    public labelPath: (item: T) => string;

    @BindableProperty
    public valuePath: (item: T) => string;

    @BindableProperty
    public match: Match<any>;

    @BindableProperty
    public suggestionRenderer: (item: T) => XNode;

    private isPopupOpen: boolean;
    input: HTMLInputElement;
    labelElement: HTMLLabelElement;

    constructor(app, e = document.createElement("drop-down-input")) {
        super(app, e);
    }

    protected preCreate(): void {
        this.items = null;
        this.value = null;
        this.labelPath = (x) => (x as any).label ?? x;
        this.valuePath = (x) => (x as any).value ?? x;
        this.itemRenderer = (x) => <div text={this.labelPath?.(x) ?? x}/>;
        this.search = "";
        this.label = "";
        this.isPopupOpen = false;
        this.disableSearch = true;
        this.render(<div
            event-click={() => this.input.focus()}>
            <input
                event-focus={() => this.onFocus()}
                value={Bind.twoWaysImmediate(() => this.search)}
                placeholder={Bind.oneWay(() => this.label)}/>
            <label text={Bind.oneWay((x) => this.labelPath(this.items.find((i) => this.valuePath(i) === this.value)))}/>
        </div>);

        this.input = this.element.querySelector("input");
        this.labelElement = this.element.querySelector("label");
    }
    onFocus(): any {
        this.label = this.input.value || this.label;
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

            const newItem = await askSuggestionPopup(
                        this as any,
                        this.items,
                        this.itemRenderer,
                        this.match ?? MatchAnyCaseInsensitive(this.labelPath),
                        selectedItem);
                    if (newItem !== selectedItem) {
                        this.value = this.valuePath?.(newItem) ?? newItem;
                        this.element.dispatchEvent(new CustomEvent(
                            "selectionChanged",
                            {
                                bubbles: true,
                                detail: newItem,
                                cancelable: true
                            }
                        ));
                    }
        } finally {
            this.isPopupOpen = false;
        } 
    }

}