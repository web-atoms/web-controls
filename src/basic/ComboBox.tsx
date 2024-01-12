import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater from "./AtomRepeater";

export default class ComboBox extends AtomRepeater {

    @BindableProperty
    public labelPath: any;

    private isChanging = false;

    constructor(app, e = document.createElement("select")) {
        super(app, e);
        this.selectedItems = [];
    }

    public updateItems(container?: HTMLElement): void {
        if (this.isChanging) {
            return;
        }
        super.updateItems(container);
        const selectedItems = this.selectedItems;
        if (!selectedItems) {
            return;
        }
        if (selectedItems.length === 0) {
            return;
        }
        this.isChanging = true;
        // we need to find item by value path
        const value = this.value;
        const valuePath = this.valuePath ?? ((item) => item);
        (this.element as HTMLSelectElement).selectedIndex = this.items?.findIndex((v) => valuePath(v) == value);
        this.isChanging = false;
    }

    protected updateClasses(): void {
        if (this.isChanging) {
            return;
        }
        super.updateClasses();
        this.updateItems();
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
        const index = (this.element as HTMLSelectElement).selectedIndex;
        if (index !== -1) {
            const si = this.selectedItems;
            if (si) {
                si.set(0, this.items[index]);
            }
        }
        this.isChanging = false;
    }

}
