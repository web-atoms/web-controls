import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater, { disposeChildren } from "./AtomRepeater";

CSS(StyleRule()
, "table[data-table-repeater=table-repeater]");

export default class TableRepeater extends AtomRepeater {

    @BindableProperty
    public header: any;

    @BindableProperty
    public headerRenderer: (item) => XNode;

    @BindableProperty
    public footer: any;

    @BindableProperty
    public footerRenderer: (item) => XNode;

    protected headerPresenter: HTMLElement;
    protected footerPresenter: HTMLElement;

    constructor(app, e) {
        super(app, e ?? document.createElement("table"));
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

    protected updateHeaderFooter(name, presenter: HTMLElement, item: any, itemRenderer: (i) => XNode)  {
        if (!(presenter && typeof item !== "undefined" && itemRenderer)) {
            return;
        }
        disposeChildren(this, presenter);
        const node = itemRenderer(item);
        const na = node.attributes ??= {};
        na["data-" + name] = name;
        this.render(<div>{ node }</div>, presenter, this);
    }

}
