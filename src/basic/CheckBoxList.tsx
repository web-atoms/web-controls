import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater, { SameObjectValue } from "./AtomRepeater";

CSS(StyleRule()
    .flexLayout({ inline: true, justifyContent: "flex-start"})
    .flexFlow("wrap"),
"div[data-checkbox-list=checkbox-list]");

CSS(StyleRule()
    .flexLayout({ justifyContent: "flex-start" })
    .marginRight(5)
    .child(StyleRule("span")
        .cursor("pointer")
    )
    .and(StyleRule("[data-selected-item=true]")
        .color(Colors.blue)
    )
    .displayNone("[data-selected-item=true] > i.far")
    .displayNone("[data-selected-item=false] > i.fas")
, "div[data-item-type=checkbox]");

export default class CheckBoxList extends AtomRepeater {

    @BindableProperty
    public labelPath;

    protected preCreate(): void {
        super.preCreate();
        this.element.dataset.checkboxList = "checkbox-list";
        this.bindEvent(this.element, "itemClick", (e: CustomEvent) => {
            const s = this.selectedItems;
            if (!s) {
                return;
            }
            const item = e.detail;
            const vp = this.valuePath ?? SameObjectValue;
            const value = vp(item);
            if (!s.some((i) => vp(i) === value)) {
                s.add(item);
                this.element.dispatchEvent(new CustomEvent("itemSelect", { detail: item, bubbles: false }));
            } else {
                this.element.dispatchEvent(new CustomEvent("itemDeselect", { detail: item, bubbles: false }));
                s.remove(item);
            }
        });

        this.itemRenderer = (item) => <div data-item-type="checkbox">
            <i class="far fa-square"/>
            <i class="fas fa-check-square"/>
            <span text={item.label}/>
        </div>;
    }

}
