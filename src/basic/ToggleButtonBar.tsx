import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import AtomRepeater from "./AtomRepeater.js";

import "./styles/toggle-button-bar.global.css";

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
