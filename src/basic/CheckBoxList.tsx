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
    .displayNone("[data-selected-item=true][data-deleted=none] > i.far")
    .displayNone("[data-selected-item=false][data-deleted=none] > i.fas")
    .displayNone("[data-selected-item=false][data-deleted=false] > i.fas")
    .displayNone("[data-selected-item=true][data-deleted=true] > i.fas")
    .displayNone("[data-selected-item=true][data-deleted=false] > i.far")
    .displayNone("[data-selected-item=false][data-deleted=true] > i.fas")
, "div[data-item-type=checkbox]");

export default class CheckBoxList extends AtomRepeater {

    @BindableProperty
    public labelPath;

    /**
     * boolean or string, if it is a string it should be the name of property. default is `$deleted` if set to true
     */
    @BindableProperty
    public softDeleteProperty: string;

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
            let existing = s.find((i) => vp(i) === value);
            if (!existing) {
                s.add(item);
                this.element.dispatchEvent(new CustomEvent("itemSelect", { detail: item, bubbles: false }));
                if(this.softDeleteProperty) {
                    item[this.softDeleteProperty] = false;
                }
                this.refreshItem(item);
            } else {
                if (this.softDeleteProperty) {

                    // this is because the items may be loaded from constant array
                    // where else selected items may come from database
                    // so we need to mirror changes
                    const existingItem = this.items.find((i) => vp(i) === value);
                    if (existing[this.softDeleteProperty] === true) {
                        existing[this.softDeleteProperty] = false;
                        if (existingItem && existingItem !== existing) {
                            existingItem[this.softDeleteProperty] = false;
                            this.element.dispatchEvent(new CustomEvent("itemSelect", { detail: item, bubbles: false }));
                            this.refreshItem(existingItem);
                        }
                        this.element.dispatchEvent(new CustomEvent("itemSelect", { detail: item, bubbles: false }));
                    } else {
                        existing[this.softDeleteProperty] = true;
                        if (existingItem && existingItem !== existing) {
                            existingItem[this.softDeleteProperty] = true;
                            this.element.dispatchEvent(new CustomEvent("itemDeselect", { detail: item, bubbles: false }));
                            this.refreshItem(existingItem);
                        }
                        this.element.dispatchEvent(new CustomEvent("itemDeselect", { detail: existing, bubbles: false }));
                    }
                    this.refreshItem(existing);
                } else {
                    this.element.dispatchEvent(new CustomEvent("itemDeselect", { detail: existing, bubbles: false }));
                    s.remove(existing);
                }
            }
        });

        this.itemRenderer = (item) => {
            if(this.softDeleteProperty) {
                return <div
                    data-deleted={!!item[this.softDeleteProperty]}
                    data-item-type="checkbox">
                    <i class="far fa-square"/>
                    <i class="fas fa-check-square"/>
                    <span text={item.label}/>
                </div>;    
            }
        return <div
            data-deleted="none"
            data-item-type="checkbox">
                <i class="far fa-square"/>
                <i class="fas fa-check-square"/>
                <span text={item.label}/>
            </div>;
        };
    }

}
