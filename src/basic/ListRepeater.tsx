import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater from "./AtomRepeater";

CSS(StyleRule()
    .child(StyleRule("[data-item-index][data-selected-item=true]")
        .backgroundColor("var(--list-selected-bg-color, lightgray)")
        .color("var(--list-selected-color, inherit)")
        .hover(StyleRule()
            .backgroundColor("var(--list-selected-bg-color-hover, lightgreen)")
            .color("var(--list-selected-color-hover, inherit)")
        )
    )
, "*[data-list-repeater=list-repeater]");

export default class ListRepeater extends AtomRepeater {

    protected preCreate() {
        this.element.setAttribute("data-list-repeater", "list-repeater");
    }
}
