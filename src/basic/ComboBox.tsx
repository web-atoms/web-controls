import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater from "./AtomRepeater";

export default class ComboBox extends AtomRepeater {

    @BindableProperty
    public labelPath: any;

    private isChanging = false;

    constructor(app, e) {
        super(app, e ?? document.createElement("select"));
    }

    public updateItems(container?: HTMLElement): void {
        super.updateItems(container);
        if (this.isChanging) {
            return;
        }
        const selectedItems = this.selectedItems;
        if (!selectedItems) {
            return;
        }
        if (selectedItems.length === 0) {
            return;
        }
        this.isChanging = true;
        const first = selectedItems[0];
        (this.element as HTMLSelectElement).selectedIndex = this.items.indexOf(first);
        this.isChanging = false;
    }

    protected preCreate(): void {
        super.preCreate();
        this.labelPath = (item) => item?.label ?? item.toString();
        this.valuePath = (item) => item?.value ?? item.toString();
        this.itemRenderer = (item) => <option>{this.labelPath(item)}</option>;

        this.bindEvent(this.element, "change", () => this.changeSelection());
    }

    protected changeSelection(): void {
        if (this.isChanging) {
            return;
        }
        this.isChanging = true;
        this.selectedItems?.clear();
        const index = (this.element as HTMLSelectElement).selectedIndex;
        if (index !== -1) {
            this.selectedItems?.add(this.items[index]);
        }
        this.isChanging = false;
    }

}