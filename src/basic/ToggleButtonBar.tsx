import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater from "./AtomRepeater";

CSS(StyleRule()
    .display("inline-grid")
    .gridAutoFlow("column")
    .alignContent("center")
    .justifyItems("stretch")
    .textAlign("center")
    .borderStyle("solid")
    .borderWidth(1)
    .borderColor(Colors.lightGray)
    .borderRadius(9999)
    .child(StyleRule("[data-item-type=toggle-button]")
        .padding(5)
        .backgroundColor(Colors.white)
        .cursor("pointer")
        .and(StyleRule(":first-child")
            .paddingLeft(10)
            .borderTopLeftRadius(9999)
            .borderBottomLeftRadius(9999)
        )
        .and(StyleRule(":last-child")
            .borderTopRightRadius(9999)
            .borderBottomRightRadius(9999)
            .paddingRight(10)
        )
        .and(StyleRule("[data-selected-item=true]")
            .backgroundColor(Colors.black)
            .color(Colors.white)
        )
    )
, "*[data-button-bar=button-bar]");

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
