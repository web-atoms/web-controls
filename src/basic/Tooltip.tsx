import { CancelToken } from "@web-atoms/core/dist/core/types";
import XNode, { xnodeSymbol } from "@web-atoms/core/dist/core/XNode";
import { AtomControl, ElementValueSetters } from "@web-atoms/core/dist/web/controls/AtomControl";
import { getParentRepeaterItem } from "./AtomRepeater";

import "./styles/tooltip.global.css";
import AtomPopover from "./elements/AtomPopover";

type toolTipInfo = [{control: any, tooltip: CancelToken}, typeof AtomPopover];

const tooltips = new Map<HTMLElement, toolTipInfo>();

ElementValueSetters.tooltip = (control: AtomControl, e: HTMLElement, value: any) => {
    tooltips.set(e, [{ control, tooltip: undefined }, value]);
    control.registerDisposable({
        dispose: () => {
            tooltips.delete(e);
        }
    });
};

document.body.addEventListener("pointerenter", (ev) => Tooltip.showTooltip(ev.target as HTMLElement), true);

document.body.addEventListener("pointerleave", (ev) => {
    const start = ev.target as HTMLElement;
    setTimeout(() => {
        const item = tooltips.get(start);
        if (!item) {
            return;
        }
        const [host] = item;
        if (host.tooltip) {
            host.tooltip.cancel();
            host.tooltip = undefined;
        }
    }, 250);
}, true);

export default abstract class Tooltip extends AtomPopover {

    public static showTooltip(target: HTMLElement) {
        let item: toolTipInfo;
        while(target) {
            item = tooltips.get(target);
            if(!item) {
                target = target.parentElement;
                continue;
            }

            break;
        }

        if (!item) {
            return;
        }

        const [host, node] = item;

        host.tooltip = node.create(target, {
            dataFactory: () => {
                let data = getParentRepeaterItem(target);
                if (!data) {
                    return AtomControl.from(target).data;
                }
                data = data[2];
                return data;
            }
        });
    }

    // public static show(start: HTMLElement) {
    //     while (start) {
    //         const item = tooltips.get(start);
    //         if (!item) {
    //             start = start.parentElement;
    //             continue;
    //         }
    //         const [host, node] = item;
    //         if (!host.tooltip) {

    //             // find associated data/item
    //             let data = getParentRepeaterItem(start);
    //             if (data) {
    //                 data = data[2];
    //             }

    //             class TooltipControl extends node {

    //                 private enterEventDisposable;

    //                 protected preCreate(): void {
    //                     this.element._logicalParent = start;
    //                     if (data) {
    //                         this.data = data;
    //                     }
    //                     const { element } = this;
    //                     // tooltips.set(element, [{ tooltip: this, control: null }, node]);
    //                     this.enterEventDisposable = this.bindEvent(element, "mouseenter", () => {
    //                         setTimeout(() => {
    //                             tooltips.set(element, [{ tooltip: host.tooltip, control: null}, null]);
    //                             delete host.tooltip;
    //                             this.enterEventDisposable.dispose();
    //                         }, 10);
    //                     });
    //                     this.registerDisposable({
    //                         dispose: () => {
    //                             tooltips.delete(element);
    //                         }
    //                     });
    //                 }
    //             }
    //             const t = new TooltipControl(host.control.app);
    //             const  alignment: any = start.dataset.tooltipAlignment ?? "right";
    //             host.tooltip = PopupService.show(start, t.element, {
    //                 alignment
    //             });
    //         }
    //         break;
    //     }
    // }
}
