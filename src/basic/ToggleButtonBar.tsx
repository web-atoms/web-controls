import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater from "./AtomRepeater";

import "./styles/toggle-button-bar-style";

export default class ToggleButtonBar extends AtomRepeater {

    @BindableProperty
    public labelPath;

    public onPropertyChanged(name: string): void {
        super.onPropertyChanged(name);
        if (name === "labelPath") {
            this.updateItems();
            return;
        }
    }

    protected preCreate(): void {
        super.preCreate();
        this.element.dataset.buttonBar = "button-bar";
        this.bindEvent(this.element, "itemClick", (e: CustomEvent) => {
            this.selectedItem = e.detail;
        });
        this.valuePath = (item) => item?.value ?? item;
        this.labelPath = (item) => item?.label ?? item;
        this.itemRenderer = (item) => <div data-item-type="toggle-button" text={this.labelPath(item)}/>;
    }
}
