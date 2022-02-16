import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater, { askSuggestion, disposeChildren, Match, MatchCaseInsensitive } from "./AtomRepeater";

CSS(StyleRule()
    .flexLayout({ inline: true, justifyContent: "stretch" as any})
, "div[data-drop-down=drop-down]");

export default class DropDown extends AtomRepeater {

    @BindableProperty
    public prompt: string;

    @BindableProperty
    public labelPath: (item) => string;

    @BindableProperty
    public match: Match<any>;

    @BindableProperty
    public suggestionRenderer: (item) => XNode;

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
        this.bindEvent(this.element, "click", () => this.openPopup());
        this.valuePath = (item) => item?.value ?? item;
        this.labelPath = (item) => item?.label ?? item;
        this.itemRenderer = (item) => <div text={this.labelPath(item)}/>;
        this.element.dataset.dropDown = "drop-down";
    }

    protected async openPopup() {
        const selected = await askSuggestion(
            this.items,
            this.suggestionRenderer ?? this.itemRenderer,
            this.match ?? MatchCaseInsensitive(this.labelPath));
        this.selectedItem = selected;
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
