import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import { CancelToken, IDisposable } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { PopupControl, PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater, { Match } from "./AtomRepeater";

CSS(StyleRule()
    .flexLayout({ justifyContent: "stretch" as any})
, "div[data-atom-chips]");

function getChips(target: HTMLElement): AtomChips {
    let start = target;
    while (start) {
        const chips = start.atomControl;
        if (chips && chips instanceof AtomChips) {
            return chips;
        }
        start = start.parentElement;
    }
}

document.body.addEventListener("focusin", (e) => {
    const chips = getChips(e.target as HTMLElement);
    (chips as any).openPopup();
});

document.body.addEventListener("keydown", (e) => {
    const chips = getChips(e.target as HTMLElement);
    (chips as any).onKeyDown(e);
});

// CSS(StyleRule()
//     .height(250)
//     .width(300)
//     .verticalFlexLayout({ alignItems: "stretch" })
//     .child(StyleRule(".items")
//         .flexStretch()
//         .overflow("auto")
//         .child(StyleRule(".presenter")
//             .child(StyleRule("*")
//                 .padding(5)
//             )
//             .child(StyleRule("[data-selected-item=true]")
//                 .backgroundColor(Colors.lightGreen)
//             )
//         )
//     )
// , "*[data-suggestion-popup=suggestion-popup]");

/**
 * Asks user for selecting item from given suggestions
 * @param items items to display
 * @param itemRenderer render function
 * @param match search match
 * @returns selected item
 */
function askSuggestionPopup<T>(
    host: HTMLElement,
    opener: AtomChips,
    itemRenderer: (item: T) => XNode,
    cancelToken: CancelToken): Promise<T> {

    class Suggestions extends PopupControl {

        private opener: AtomChips;

        protected create(): void {
            this.opener = opener;
            this.render(<div data-suggestion-popup="suggestion-popup">
                <div class="items">
                    <AtomRepeater
                        class="presenter"
                        selectedItem={Bind.oneWay(() => this.opener.anchorItem)}
                        itemRenderer={itemRenderer}
                        eventItemClick={(e) => {
                            this.close(e.detail);
                        }}
                        items={Bind.oneWay(() => this.opener.suggestions)}/>
                </div>
            </div>);
        }
    }

    return Suggestions.showControl(host, { cancelToken });
}
export default class AtomChips extends AtomRepeater {

    public "event-selection-changed"?: (e: CustomEvent) => void;

    @BindableProperty
    public suggestions: any[];

    @BindableProperty
    public search: string;

    @BindableProperty
    public prompt: string;

    @BindableProperty
    public suggestionPrompt: string;

    @BindableProperty
    public labelPath: (item) => string;

    @BindableProperty
    public match: Match<any>;

    @BindableProperty
    public suggestionRenderer: (item) => XNode;

    public anchorItem: any;

    private searchInput: HTMLInputElement;

    private anchorIndex: number;

    private popupCancelToken: CancelToken;

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
        // super.preCreate();
        this.prompt = "Select";
        this.element.dataset.atomChips = "atom-chips";
        // this.bindEvent(this.element, "click", () => this.searchInput.focus());
        this.valuePath = (item) => item?.value ?? item;
        this.labelPath = (item) => item?.label ?? item;
        this.itemRenderer = (item) => <div text={this.labelPath(item)}/>;
        this.element.dataset.dropDown = "drop-down";
        this.render(<div>
            <i class="fad fa-search"/>
            <div class="presenter"></div>
            <input
                class="search"
                placeholder={Bind.oneWay(() => this.prompt)}
                value={Bind.twoWaysImmediate(() => this.search)}
                type="search"/>
        </div>);
        this.itemsPresenter = this.element.querySelector("presenter")[0];
        this.searchInput = this.element.querySelector("search")[0];
    }

    protected async openPopup() {
        if (this.popupCancelToken) {
            return;
        }
        const cancelToken = this.popupCancelToken = new CancelToken();
        try {
            const selectedItem = await askSuggestionPopup(
                this.element,
                this,
                this.suggestionRenderer ?? this.itemRenderer,
                cancelToken);
            this.addItem(selectedItem);
        } catch (e) {
            if (CancelToken.isCancelled(e)) {
                return;
            }
            // tslint:disable-next-line: no-console
            console.warn(e);
        }
    }

    protected addItem(selectedItem) {
        const ce = new CustomEvent("suggestionChosen", {
            detail: selectedItem,
            cancelable: true,
            bubbles: true
        });
        this.element.dispatchEvent(ce);
        if (!ce.defaultPrevented) {
            this.items.add(ce.detail);
        }
    }

    protected onKey(e: KeyboardEvent) {
        const suggested = this.suggestions;
        switch (e.key) {
            case "Enter":
                // selection mode...
                const anchorItem = this.anchorItem;
                if (!anchorItem) {
                    return;
                }
                this.anchorIndex = 0;
                this.addItem(anchorItem);
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
