import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater from "./AtomRepeater";

export default class TableRepeater extends AtomRepeater {

    constructor(app, e = document.createElement("table")) {
        super(app, e);
    }

    public onPropertyChanged(name: keyof TableRepeater): void {
        super.onPropertyChanged(name);
        switch (name) {
            case "header":
            case "headerRenderer":
                this.updateHeaderFooter("header", this.headerPresenter, this.header, this.headerRenderer);
                break;
            case "footer":
            case "footerRenderer":
                this.updateHeaderFooter("footer", this.footerPresenter, this.footer, this.footerRenderer);
                break;
        }
    }

    protected preCreate(): void {
        super.preCreate();
        this.preRender();
        this.onPropertyChanged("header");
        this.onPropertyChanged("footer");
    }

    protected preRender() {
        this.element.dataset.tableRepeater = "table-repeater";
        this.render(<table>
            <thead></thead>
            <tbody></tbody>
            <tfoot></tfoot>
        </table>);
        this.itemsPresenter = this.element.querySelector("tbody");
        this.headerPresenter = this.element.firstElementChild as HTMLElement;
        this.footerPresenter = this.element.lastElementChild as HTMLElement;
    }
}
