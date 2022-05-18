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
    )
    .child(StyleRule(".presenter")
        .flexLayout({ inline: true })
        .child(StyleRule("*")
            .backgroundColor(Colors.lightGray.withAlphaPercent(0.3))
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
    (chips as any)?.openPopup();
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
}

CSS(StyleRule()
    .padding(1)
    .paddingLeft(5)
    .paddingRight(5)
    .borderRadius(10)
    .display("grid")
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
, "*[data-item-chip]");

export function Chip(
    {
        icon,
        label,
        header,
        deleteIcon = "fa-solid fa-xmark",
        draggable
    }: IChip, ... nodes: XNode[]) {
    return <div
        data-item-chip="chip"
        draggable={draggable}>
        { icon && <i class={"icon " + icon}/>}
        { header && <label class="header" text={label}/>}
        { label && <label class="label" text={label}/>}
        { ... nodes }
        { deleteIcon && <i class={"delete " + deleteIcon} data-click-event="remove-chip"/> }
    </div>;
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

    public itemToChip: (item, search) => any;

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
        this.prompt = "Search";
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
        this.itemsPresenter = this.element.children[1];
        this.searchInput = this.element.children[2] as HTMLInputElement;
        this.bindEvent(this.element, "removeChip", (e: CustomEvent) => this.items.remove(e.detail));
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
            this.popupCancelToken = null;
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
