import Colors from "@web-atoms/core/dist/core/Colors";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { AtomItemsControl } from "@web-atoms/core/dist/web/controls/AtomItemsControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

CSS(StyleRule()
    .flexLayout({ inline: true, gap: 0 })
    .border("solid 1px lightblue")
    .borderRadius(10)
    .child(StyleRule("*")
        .borderRadius(10)
        .padding(5)
        .cursor("pointer")
        .and(StyleRule(":first-child")
            .borderTopRightRadius(0)
            .borderBottomRightRadius(0)
        )
        .and(StyleRule(":last-child")
            .borderTopLeftRadius(0)
            .borderBottomLeftRadius(0)
        )
    )
    .child(StyleRule("*[data-item=selected-item]")
        .backgroundColor(Colors.lightBlue)
    )
, "*[data-button-bar=button-bar]");

export default class AtomButtonBar extends AtomItemsControl {

    protected preCreate(): void {
        this.allowSelectFirst = true;
        super.preCreate();
        this.element.dataset.buttonBar = "button-bar";
        this.runAfterInit(() => {
            if (!this.selectedItem) {
                this.selectedItem = this.items[0] ?? null;
            }
        });
    }

    protected createChild(df: DocumentFragment, data: any): AtomControl {
        const child = super.createChild(df, data);
        child.element.dataset.buttonBarItem = "item";
        child.bindEvent(child.element, "click", () => {
            this.selectedItem = child.data;
        });
        child.bind(child.element,
            "data-item",
            [["data"], ["this", "selectedItem"]],
            false, (v1, v2) => v1 === v2 ? "selected-item" : "item" , this );
        return child;
    }

}
