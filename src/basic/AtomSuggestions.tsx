import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import { IDisposable } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater, { askSuggestion, askSuggestionPopup } from "./AtomRepeater";

CSS(StyleRule()
.margin(5)
.flexLayout({})
.overflow("hidden")
.child(StyleRule(".header")
    .color(Colors.darkOrange)
    .whiteSpace("nowrap")
)
.child(StyleRule(".items")
    .flexStretch()
    .flexLayout({ justifyContent: "flex-start", gap: 0 })
    .overflow("hidden")
    .child(StyleRule("*")
        .whiteSpace("nowrap")
        .padding(3)
        .cursor("pointer")
        .hover(StyleRule()
            .color(Colors.blue)
            .textDecoration("underline")
        )
    )
)
.child(StyleRule(".more")
    .fontSize("smaller")
    .color(Colors.blue)
    .textTransform("lowercase")
    .textDecoration("underline")
    .cursor("pointer")
)
, "*[data-suggestions=suggestions]");

export default class AtomSuggestions extends AtomRepeater {

    public eventItemClick: any;

    @BindableProperty
    public valuePath: any;

    // Title to be displayed on the popup window for e.g. When we click on more in project tags
    @BindableProperty
    public title: string;

    @BindableProperty
    public match: (text) => (item) => boolean;

    @BindableProperty
    public version: number;

    @BindableProperty
    public suggestionRenderer: (item) => XNode;

    @BindableProperty
    public popupSuggestions: boolean;

    private selectedItemsWatcher: IDisposable;

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
                // this.updateVisibility(this.itemsPresenter);
                const vp = this.valuePath ?? ((item) => item);
                const selectedValues = (this.selectedItems ?? []).map(vp);
                this.visibilityFilter = (item) => {
                    const v = vp(item);
                    return selectedValues.length === 0 || selectedValues.indexOf(v) === -1;
                };
                break;
        }
    }

    protected create(): void {
        this.version = 1;
        this.render(<div data-suggestions="suggestions" eventItemClick={(e) => this.selectedItems?.add(e.detail)}>
            <span class="header" text={Bind.oneWay(() => this.title)}/>
            <div class="items"></div>
            <div class="more" eventClick={Bind.event(() => this.more())}>More</div>
        </div>);
        this.itemsPresenter = this.element.children[1] as HTMLElement;
        this.updateItems();
    }

    protected async more() {
        const vf = this.visibilityFilter ?? ((item) => true);
        if (!this.popupSuggestions) {
            const selected = await askSuggestion(
                this.items.filter(vf),
                this.suggestionRenderer ?? this.itemRenderer,
                (text: string) => this.match(text),
                { title: this.title });
            this.selectedItems?.add(selected);
        }

        const selectedItem = await askSuggestionPopup(
            this,
            this.items,
            this.suggestionRenderer ?? this.itemRenderer,
            (text: string) => this.match(text),
            this.selectedItem);
        this.selectedItems?.add(selectedItem);
        this.element.dispatchEvent(new CustomEvent(
            "itemAdded",
            {
                bubbles: true,
                detail: selectedItem,
                cancelable: true
            }
        ));
    }

}
