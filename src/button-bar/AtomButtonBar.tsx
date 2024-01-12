import styled from "@web-atoms/core/dist/style/styled";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { AtomItemsControl } from "@web-atoms/core/dist/web/controls/AtomItemsControl";

    styled.css `
    display: inline-flex;
    gap: 0;
    align-items: center;
    border: solid 1px lightblue;
    border-radius: 10px;
    padding-left: 10px;
    padding-right: 10px;
    & > * {
        border-radius: 10px;
        padding: 5px;
        cursor: pointer;
        &:first-child {
            border-top-right-radius: 0;
            border-bottom-right-radius:0;
        }
        &:last-child {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        &[data-item=selected-item] {
            background-color: lightblue;
        }
    }
`.installGlobal("*[data-button-bar=button-bar]");

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
