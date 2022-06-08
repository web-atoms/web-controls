import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater, { disposeChildren } from "./AtomRepeater";

CSS(StyleRule()
, "table[data-table-repeater=table-repeater]");

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
