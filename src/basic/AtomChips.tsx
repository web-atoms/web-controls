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
import IElement from "./IElement";

CSS(StyleRule()
    .flexLayout({ justifyContent: "stretch" as any})
    .flexFlow("wrap")
    .child(StyleRule(".search")
        .border("none")
        .outline("none")
        .flex("1 1")
    )
    .child(StyleRule(".footer")
        .marginLeft("auto")
    )
    .child(StyleRule(".presenter")
        .flexLayout({ inline: true, justifyContent: "flex-start" })
        .flexFlow("wrap")
        .child(StyleRule("*")
            .backgroundColor(Colors.lightGray.withAlphaPercent(0.3))
        )
    )
    .and(StyleRule("[data-mode=search]")
        .child(StyleRule(".search")
            .paddingLeft(20)
            // tslint:disable-next-line: max-line-length
            .background(`transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E") no-repeat 1px center` as any)
        )
    )
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
                        eventDeleteSuggestion={(e) => opener.element.dispatchEvent(e) }
                        eventItemClick={(e) => {
                            this.close(e.detail);
                        }}
                        items={Bind.oneWay(() => this.opener.suggestions)}/>
                </div>
            </div>);
        }
    }

    return Suggestions.showControl(host, { cancelToken, alignment: "auto" });
}

export interface IChip extends IElement {
    icon?: string;
    header?: string;
    label?: string;
    deleteIcon?: string;
    draggable?: boolean;
    recreate?: boolean;
    deleted?: boolean;
}

CSS(StyleRule()
    .padding(1)
    .paddingLeft(5)
    .paddingRight(5)
    .borderRadius(10)
    .display("grid")
    .alignItems("center")
    .gridTemplateRows("auto 1fr")
    .gridTemplateColumns("auto 1fr auto")
    .child(StyleRule("[data-content]")
        .gridRowStart("2")
        .gridColumnStart("2")
    )
    .child(StyleRule(".icon")
        .gridColumnStart("1")
        .gridRowStart("1")
        .gridRowEnd("span 2")
        .alignSelf("center")
    )
    .child(StyleRule(".delete")
        .gridColumnStart("3")
        .gridRowStart("1")
        .gridRowEnd("span 2")
        .alignSelf("center")
        .fontSize("small")
        .backgroundColor(Colors.transparent)
        .borderRadius(4)
        .padding(2)
        .color(Colors.gray)
        .hover(StyleRule()
            .backgroundColor(Colors.lightGray)
            .color(Colors.red)
        )
    )
    .child(StyleRule(".header")
        .fontSize("x-small")
        .gridRowStart("1")
        .gridColumnStart("2")
    )
    .child(StyleRule(".label")
        .gridRowStart("2")
        .gridColumnStart("2")
    )
    .and(StyleRule("[data-deleted=true]")
        .display("none")
    )
, "*[data-item-chip]");

export function Chip(
    {
        icon,
        label,
        header,
        deleteIcon = "fa-solid fa-xmark",
        draggable,
        recreate = true,
        deleted,
    }: IChip,
    ... nodes: XNode[]) {
    return <div
        data-recreate={recreate}
        data-deleted={!!deleted}
        data-item-chip="chip"
        draggable={draggable}>
        { icon && <i class={"icon " + icon}/>}
        { header && <label class="header" text={header}/>}
        { label && <label class="label" text={label}/>}
        { ... nodes }
        { deleteIcon && <i class={"delete " + deleteIcon} data-click-event="remove-chip"/> }
    </div>;
}

CSS(StyleRule()
    .padding(1)
    .paddingLeft(5)
    .paddingRight(5)
    .borderRadius(10)
    .display("grid")
    .alignItems("center")
    .gridTemplateRows("auto 1fr")
    .gridTemplateColumns("auto 1fr auto")
    .child(StyleRule("[data-content]")
        .gridRowStart("2")
        .gridColumnStart("2")
    )
    .child(StyleRule(".icon")
        .gridColumnStart("1")
        .gridRowStart("1")
        .gridRowEnd("span 2")
        .alignSelf("center")
    )
    .child(StyleRule(".delete")
        .gridColumnStart("3")
        .gridRowStart("1")
        .gridRowEnd("span 2")
        .alignSelf("center")
        .color(Colors.red)
    )
    .child(StyleRule(".header")
        .fontSize("x-small")
        .gridRowStart("1")
        .gridColumnStart("2")
    )
    .child(StyleRule(".label")
        .gridRowStart("2")
        .gridColumnStart("2")
    )
, "*[data-item-suggestion]");

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

export default class AtomChips extends AtomRepeater {

    /**
     * Fired when user chooses an item from suggestions displayed,
     * You can call preventDefault() to prevent suggestion to be
     * added in the chips. You can expect detail and you can
     * change the item by changing detail or by assigning to new
     * object
     */
    public "event-suggestion-chosen"?: (e: CustomEvent) => any;

    /**
     * Fired when user tries to remove the chip, you can call
     * preventDefault() to prevent chip from being removed.
     */
    public "event-remove-chip"?: (e: CustomEvent) => any;

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

    public itemToChip: (item, search) => any;

    @BindableProperty
    public focused: boolean;

    public anchorItem: any;

    private searchInput: HTMLInputElement;

    private anchorIndex: number;

    private popupCancelToken: CancelToken;

    private suggestionsWatcher: IDisposable;

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
        // super.preCreate();
        this.prompt = "Search";
        this.element.dataset.atomChips = "atom-chips";
        this.element.dataset.mode = "search";
        // this.bindEvent(this.element, "click", () => this.searchInput.focus());
        this.valuePath = (item) => item?.value ?? item;
        this.labelPath = (item) => item?.label ?? item;
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
        this.bindEvent(this.element, "removeChip", (e: CustomEvent) => this.removeItem(e.detail));
    }

    protected setFocus(hasFocus) {
        if (hasFocus) {
            this.focused = true;
            return;
        }
        setTimeout(() => {
            this.focused = false;
        }, 250);
    }

    protected async updatePopup() {
        const suggestions = this.suggestions;
        if (!this.focused) {
            this.popupCancelToken?.cancel();
            this.popupCancelToken = null;
            return;
        }
        if (!suggestions || !suggestions.length) {
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
            this.items.add(ce.detail);
        }
    }

    protected removeItem(detail) {
        const ce = new CustomEvent("removeChip", {
            detail,
            cancelable: true,
            bubbles: true
        });
        if (!ce.defaultPrevented) {
            this.items.remove(ce.detail);
        }
    }

    protected onKey(e: KeyboardEvent) {
        const suggested = this.suggestions;
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
