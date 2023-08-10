import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import { CancelToken, IDisposable } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater, { Match, MatchTrue } from "./AtomRepeater";
import type { IChip } from "./Chip";
export { default as Chip } from "./Chip";
import InlinePopup from "./InlinePopup";

import "./styles/chips-style";
import "./styles/item-suggestion-style";

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
    (chips as any)?.setFocus(true);
});

document.body.addEventListener("focusout", (e) => {
    const chips = getChips(e.target as HTMLElement);
    (chips as any)?.setFocus(false);
});

document.body.addEventListener("keydown", (e) => {
    const chips = getChips(e.target as HTMLElement);
    (chips as any)?.onKey(e);
});

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
    itemRenderer: (item: T, index: number, repeater: AtomRepeater) => XNode,
    suggestionFilter: (item) => boolean,
    cancelToken: CancelToken): Promise<T> {

    class Suggestions extends InlinePopup {

        private opener: AtomChips;

        protected create(): void {
            this.opener = opener;
            this.render(<div data-suggestion-popup="suggestion-popup">
                <div class="items">
                    <AtomRepeater
                        class="presenter"
                        selectedItem={Bind.oneWay(() => this.opener.anchorItem)}
                        itemRenderer={itemRenderer}
                        eventDeleteSuggestion={(e) => opener.element.dispatchEvent(e) }
                        visibilityFilter={suggestionFilter ?? MatchTrue}
                        event-item-click={(e: CustomEvent) => {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            e.stopPropagation();
                            this.close(e.detail);
                        }}
                        items={Bind.oneWay(() => this.opener.suggestions)}/>
                </div>
            </div>);
        }
    }

    return Suggestions.showControl(host, { cancelToken, alignment: "auto" });
}

export function Suggestion(
    {
        icon,
        label,
        header,
        deleteIcon
    }: IChip,
    ... nodes: XNode[]) {
    return <div
        data-item-suggestion="suggestion">
        { icon && <i class={"icon " + icon}/>}
        { header && <label class="header" text={header}/>}
        { label && <label class="label" text={label}/>}
        { ... nodes }
        { deleteIcon && <i class={"delete " + deleteIcon} data-click-event="remove-suggestion"/> }
    </div>;
}

export default class AtomChips<T = any> extends AtomRepeater<T> {

    /**
     * Fired when user chooses an item from suggestions displayed,
     * You can call preventDefault() to prevent suggestion to be
     * added in the chips. You can expect detail and you can
     * change the item by changing detail or by assigning to new
     * object
     */
    public "event-suggestion-chosen"?: (e: CustomEvent<T>) => any;

    /**
     * Fired just before suggestions are about to be displayed
     */
    public "event-suggestions-requested"?: (ce: CustomEvent<T[]>) => any;

    /**
     * Fired when user tries to remove the chip, you can call
     * preventDefault() to prevent chip from being removed.
     */
    public "event-remove-chip"?: (e: CustomEvent<T>) => any;

    @BindableProperty
    public suggestions: T[];

    @BindableProperty
    public search: string;

    @BindableProperty
    public prompt: string;

    @BindableProperty
    public suggestionPrompt: string;

    /**
     * boolean or string, if it is a string it should be the name of property. default is `$deleted` if set to true
     */
    @BindableProperty
    public softDeleteProperty: string;

    @BindableProperty
    public labelPath: (item: T) => string;

    @BindableProperty
    public match: Match<any>;

    @BindableProperty
    public suggestionRenderer: (item: T, index: number, repeater: AtomRepeater) => XNode;

    @BindableProperty
    public suggestionFilter: (item) => boolean;

    public itemToChip: (item, search) => any;

    public preventDuplicates: boolean;

    @BindableProperty
    public focused: boolean;

    public anchorItem: any;

    @BindableProperty
    public onKeyPressedItemToChip: (key: string, search: string) => any;

    @BindableProperty
    public onBlurItemToChip: (search: string) => any;

    public get searchType() {
        return this.searchInput.type;
    }

    public set searchType(v: string) {
        this.searchInput.type = v;
    }

    
    public get enterKeyHint() {
        return this.searchInput.enterKeyHint;
    }

    public set enterKeyHint(v: string) {
        this.searchInput.enterKeyHint = v;
    }

    private searchInput: HTMLInputElement;

    private anchorIndex: number;

    private popupCancelToken: CancelToken;

    private suggestionsWatcher: IDisposable;

    private focusTimeout;

    public onPropertyChanged(name: string): void {
        super.onPropertyChanged(name);
        switch (name) {
            case "labelPath":
                this.itemRenderer = (item) => <div text={this.labelPath(item)}/>;
                break;
            case "prompt":
                this.updateClasses();
                break;
            case "focused":
                this.updatePopup();
                break;
            case "suggestions":
                this.suggestionsWatcher?.dispose();
                this.suggestionsWatcher = undefined;
                const suggestions = this.suggestions;
                if (suggestions) {
                    this.suggestionsWatcher = this.registerDisposable(suggestions.watch(() => {
                        this.updatePopup();
                    }));
                }
                this.updatePopup();
                break;
        }
    }

    protected preCreate(): void {
        super.preCreate();
        this.preventDuplicates = true;
        this.softDeleteProperty = null;
        this.prompt = "Search";
        this.element.setAttribute("data-atom-chips", "atom-chips");
        this.element.setAttribute("data-mode", "search");
        this.suggestionFilter = MatchTrue;
        // this.bindEvent(this.element, "click", () => this.searchInput.focus());
        this.valuePath = (item: any) => item?.value ?? item;
        this.labelPath = (item: any) => item?.label ?? item;
        this.itemRenderer = (item) => <div text={this.labelPath(item)}/>;
        this.element.dataset.dropDown = "drop-down";
        this.render(<div>
            <div class="presenter"></div>
            <input
                class="search"
                placeholder={Bind.oneWay(() => this.prompt)}
                value={Bind.twoWaysImmediate(() => this.search)}
                type="search"/>
            <div class="footer"/>
        </div>);
        this.itemsPresenter = this.element.children[0];
        this.searchInput = this.element.children[1] as HTMLInputElement;
        this.footerPresenter = this.element.children[2] as HTMLInputElement;
        this.bindEvent(this.element, "removeChip", (e: CustomEvent) => e.defaultPrevented || this.removeItem(e.detail));
        this.bindEvent(this.element, "undoRemoveChip", (e: CustomEvent) =>
            e.defaultPrevented || this.undoRemoveItem(e.detail));
        this.bindEvent(this.searchInput, "blur", () => {
            if (this.onBlurItemToChip && this.search) {
                const item = this.onBlurItemToChip(this.search);
                if (item) {
                    this.items.add(item);
                    this.searchInput.value = "";
                }
            }
        });
    }

    protected setFocus(hasFocus) {
        if (hasFocus) {
            if(this.focusTimeout) {
                clearTimeout(this.focusTimeout);
                this.focusTimeout = void 0;
            }
            this.focused = true;
            return;
        }
        this.focusTimeout = setTimeout(() => {
            this.focusTimeout = void 0;
            this.focused = false;
        }, 1500);
    }

    protected async updatePopup() {
        const suggestions = this.suggestions;
        if (!this.focused) {
            this.popupCancelToken?.cancel();
            this.popupCancelToken = null;
            return;
        }

        const detail = this.suggestions;
        const ce = new CustomEvent("suggestions-requested", { detail });
        this.element.dispatchEvent(ce);
        if (ce.defaultPrevented) {
            return;
        }
        const { promise } = ce as any;
        if (promise) {
            await promise;
        }
        if (ce.detail !== this.suggestions) {
            this.suggestions = ce.detail;
        }

        if (!(suggestions?.length)) {
            this.popupCancelToken?.cancel();
            this.popupCancelToken = null;
            return;
        }

        if (this.popupCancelToken) {
            return;
        }

        const cancelToken = this.popupCancelToken = new CancelToken();
        try {
            let selectedItem = await askSuggestionPopup(
                this.element,
                this,
                this.suggestionRenderer ?? this.itemRenderer,
                this.suggestionFilter,
                cancelToken);
            const itemToChip = this.itemToChip;
            if (itemToChip) {
                selectedItem = itemToChip(selectedItem, this.search);
            }
            this.addItem(selectedItem);
            this.search = "";
            this.popupCancelToken = null;
        } catch (e) {
            this.popupCancelToken = null;
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
            const item = ce.detail;
            const vp = this.valuePath ?? ((x) => x);
            const v = vp(item);
            for (const iterator of this.items) {
                if (v === vp(iterator)) {
                    return;
                }
            }
            this.items.add(ce.detail);
        }
    }

    protected undoRemoveItem(item) {
        let { softDeleteProperty } = this;
        softDeleteProperty = typeof softDeleteProperty !== "string" ? "$deleted" : softDeleteProperty;
        item[softDeleteProperty] = false;
        AtomBinder.refreshValue(this.items, "length");
        this.refreshItem(item);
    }

    protected removeItem(item) {

        let { softDeleteProperty } = this;
        if (softDeleteProperty) {
            softDeleteProperty = typeof softDeleteProperty !== "string" ? "$deleted" : softDeleteProperty;
            item[softDeleteProperty] = true;
            AtomBinder.refreshValue(this.items, "length");
            this.refreshItem(item);
        } else {
            this.items.remove(item);
        }
    }

    protected onKey(e: KeyboardEvent) {
        const suggested = this.suggestions;
        const onKeyPressedItemToChip = this.onKeyPressedItemToChip;
        if (onKeyPressedItemToChip && this.search) {
            const item = onKeyPressedItemToChip(e.key, this.search);
            if (item) {
                this.addItem(item);
                this.searchInput.value = "";
                return;
            }
        }
        switch (e.key) {
            case "Enter":
                // selection mode...
                e.preventDefault?.();
                e.stopImmediatePropagation?.();
                setTimeout(() => {
                    let anchorItem = this.anchorItem;
                    const itemToChip = this.itemToChip;
                    if (itemToChip) {
                        anchorItem = itemToChip(anchorItem, this.search);
                    }
                    if (!anchorItem) {
                        return;
                    }
                    this.addItem(anchorItem);
                    this.anchorIndex = 0;
                    this.anchorItem = null;
                    this.search = "";
                }, 1);
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
