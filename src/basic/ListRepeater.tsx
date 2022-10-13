import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater from "./AtomRepeater";

CSS(StyleRule()
    .child(StyleRule("*[data-item-index]")
        .padding(5)
        .borderRadius(5)
        .backgroundColor("var(--list-bg-color)")
        .color("var(--list-color)")
        .hover(StyleRule()
            .backgroundColor("var(--list-selected-bg-color-hover, lightgreen)")
            .color("var(--list-selected-color-hover, inherit)")
        )
        .child(StyleRule("td")
            .padding(5)
        )
    )
    .child(StyleRule("*[data-item-index][data-selected-item=true]")
        .backgroundColor("var(--list-selected-bg-color, lightgray)")
        .color("var(--list-selected-color, inherit)")
        .hover(StyleRule()
            .backgroundColor("var(--list-selected-bg-color-hover, lightgreen)")
            .color("var(--list-selected-color-hover, inherit)")
        )
    )
, "*[data-list-repeater=list-repeater]");

export default class ListRepeater extends AtomRepeater {

    @BindableProperty
    public autoSelectOnClick: boolean;

    protected preCreate() {
        this.autoSelectOnClick = true;
        this.element.setAttribute("data-list-repeater", "list-repeater");
    }

    protected dispatchItemEvent(eventName, item, recreate, originalTarget, nestedItem) {
        super.dispatchItemEvent(eventName, item, recreate, originalTarget, nestedItem);
        if (!this.autoSelectOnClick) {
            return;
        }
        if (this.allowMultipleSelection) {
            if (!this.selectedItems.remove(item)) {
                this.selectedItems.add(item);
            }
            return;
        }
        this.selectedItem = item;
    }
}
