import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater from "./AtomRepeater";

import "./styles/radio-button-list-style";

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
