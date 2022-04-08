import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule, { AnimationType } from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl, ElementValueSetters } from "@web-atoms/core/dist/web/controls/AtomControl";
import PopupService, { IPopup, PopupControl } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater, { getParentRepeaterItem } from "./AtomRepeater";

const tooltips = new Map<HTMLElement, [{control: any, tooltip: IPopup}, typeof AtomControl]>();

ElementValueSetters.tooltip = (control: AtomControl, e: HTMLElement, value: any) => {
    tooltips.set(e, [{ control, tooltip: undefined }, value]);
    control.registerDisposable({
        dispose: () => {
            tooltips.delete(e);
        }
    });
};

document.body.addEventListener("pointerenter", (ev) => {
    let start = ev.target as HTMLElement;
    while (start) {
        const item = tooltips.get(start);
        if (!item) {
            start = start.parentElement;
            continue;
        }
        const [host, node] = item;
        if (!host.tooltip) {

            // find associated data/item
            let data = getParentRepeaterItem(start);
            if (data) {
                data = data[2];
            }

            class TooltipControl extends node {

                private enterEventDisposable;

                protected preCreate(): void {
                    this.element._logicalParent = start;
                    if (data) {
                        this.data = data;
                    }
                    const { element } = this;
                    // tooltips.set(element, [{ tooltip: this, control: null }, node]);
                    this.enterEventDisposable = this.bindEvent(element, "mouseenter", () => {
                        setTimeout(() => {
                            tooltips.set(element, [{ tooltip: host.tooltip, control: null}, null]);
                            delete host.tooltip;
                            this.enterEventDisposable.dispose();
                        }, 10);
                    });
                    this.registerDisposable({
                        dispose: () => {
                            tooltips.delete(element);
                        }
                    });
                }
            }
            const t = new TooltipControl(host.control.app);
            const  alignment: any = start.dataset.tooltipAlignment ?? "auto";
            host.tooltip = PopupService.show(start, t.element, {
                alignment
            });
        }
        break;
    }
}, true);

document.body.addEventListener("pointerleave", (ev) => {
    const start = ev.target as HTMLElement;
    setTimeout(() => {
        const item = tooltips.get(start);
        if (!item) {
            return;
        }
        const [host] = item;
        if (host.tooltip) {
            host.tooltip.dispose();
            host.tooltip = undefined;
        }
    }, 250);
}, true);

CSS(StyleRule()
    .verticalFlexLayout({})
    .padding(10),
"div[data-tooltip=tooltip]");

export default class Tooltip extends AtomControl {
}
