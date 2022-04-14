import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import { CancelToken, IDisposable } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater, { askSuggestion, askSuggestionPopup,
    disposeChildren, Match, MatchAnyCaseInsensitive } from "./AtomRepeater";

CSS(StyleRule()
    .flexLayout({ inline: true, justifyContent: "stretch" as any})
, "div[data-drop-down=drop-down]");

export default class DropDown extends AtomRepeater {

    public "event-selection-changed"?: (e: CustomEvent) => void;

    @BindableProperty
    public popupSuggestions: boolean;

    @BindableProperty
    public search: string;

    @BindableProperty
    public prompt: string;

    @BindableProperty
    public suggestionPrompt: string;

    @BindableProperty
    public itemsFunc: (name: string, ct: CancelToken) => Promise<any[]> | any;

    /**
     * Default is 250
     */
    @BindableProperty
    public itemsFuncWaitInMS: number;

    @BindableProperty
    public labelPath: (item) => string;

    @BindableProperty
    public match: Match<any>;

    @BindableProperty
    public suggestionRenderer: (item) => XNode;

    private searchTimeout = null;

    private searchCancelToken: CancelToken;

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
            case "search":
                if (this.itemsFunc) {
                    if (this.searchTimeout) {
                        clearTimeout(this.searchTimeout);
                        this.searchTimeout = undefined;
                    }
                    this.searchTimeout = setTimeout(() =>
                        this.app.runAsync(() =>
                            this.updateSearchItems()) , this.itemsFuncWaitInMS);
                }
                break;
        }
    }

    protected async updateSearchItems() {
        this.searchTimeout = undefined;
        let ct = this.searchCancelToken;
        ct?.cancel();
        this.searchCancelToken = ct = new CancelToken();
        let results = this.itemsFunc(this.search, ct) as any;
        if (results?.then) {
            results = await results;
        }
        this.items = results;
        this.searchCancelToken = null;
    }

    protected preCreate(): void {
        // super.preCreate();
        this.itemsFuncWaitInMS = 250;
        this.prompt = "Select";
        this.popupSuggestions = true;
        this.bindEvent(this.element, "click", () => this.openPopup());
        this.valuePath = (item) => item?.value ?? item;
        this.labelPath = (item) => item?.label ?? item;
        this.itemRenderer = (item) => <div text={this.labelPath(item)}/>;
        this.element.dataset.dropDown = "drop-down";
        this.render(<div>
            <div text={this.prompt}/>
            <i class="fad fa-caret-circle-down"/>
        </div>);
        this.runAfterInit(() => {
            if (this.itemsFunc) {
                this.onPropertyChanged("search");
            }
        });
    }

    protected async openPopup() {
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
    }

    protected updateClasses(): void {
        disposeChildren(this, this.element);
        const ir = this.itemRenderer;
        if (!ir) {
            return;
        }
        if (!this.selectedItem) {
            this.render(<div>
                <div text={this.prompt}/>
                <i class="fad fa-caret-circle-down"/>
            </div>);
            return;
        }
        this.render(<div>
            { ir(this.selectedItem) }
            <i class="fad fa-caret-circle-down"/>
        </div>);
    }

}
