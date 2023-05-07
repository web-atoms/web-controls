import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import AtomRepeater from "./AtomRepeater";

import "./styles/list-repeater-style";
export default class ListRepeater<T = any> extends AtomRepeater<T> {

    @BindableProperty
    public autoSelectOnClick: boolean;

    protected preCreate() {
        super.preCreate();
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
