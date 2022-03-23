import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater from "./AtomRepeater";

CSS(StyleRule()
    .flexLayout({ inline: true, justifyContent: "flex-start"})
    .flexFlow("wrap"),
"*[data-radio-button-list=radio-button-list]");

CSS(StyleRule()
    .flexLayout({ justifyContent: "flex-start" })
    .marginRight(5)
    .child(StyleRule("span")
        .cursor("pointer")
    )
    .and(StyleRule("[data-selected-item=true]")
        .color(Colors.blue)
    )
    .displayNone("[data-selected-item=true] > i.fa-circle")
    .displayNone("[data-selected-item=false] > i.fa-dot-circle")
, "div[data-item-type=radio]");

export default class RadioButtonList extends AtomRepeater {

    protected preCreate(): void {
        super.preCreate();
        this.valuePath = (item) => item?.value ?? item;
        this.bindEvent(this.element, "itemClick", (e: CustomEvent) => {
            const s = this.selectedItems;
            if (!s) {
                return;
            }
            const item = e.detail;
            const old = this.selectedItem;
            if (old) {
                this.element.dispatchEvent(new CustomEvent("itemDeselect", { detail: old, bubbles: false }));
            }
            this.selectedItem = item;
            this.element.dispatchEvent(new CustomEvent("itemSelect", { detail: item, bubbles: false }));
        });
        this.element.dataset.radioButtonList = "radio-button-list";
        this.itemRenderer = (item) => <div
            data-item-type="radio">
            <i class="far fa-dot-circle"/>
            <i class="far fa-circle"/>
            <span text={item.label}/>
        </div>;

    }

}
