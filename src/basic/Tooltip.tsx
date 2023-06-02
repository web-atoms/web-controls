import { CancelToken } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl, ElementValueSetters } from "@web-atoms/core/dist/web/controls/AtomControl";
import { getParentRepeaterItem } from "./AtomRepeater";
import InlinePopup from "./InlinePopup";

import "./styles/tooltip-style";

const tooltips = new Map<HTMLElement, [{control: any, tooltip: CancelToken}, typeof InlinePopup]>();

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

export default class Tooltip extends InlinePopup {

    public static showTooltip(start: HTMLElement) {
        while (start) {
            const item = tooltips.get(start);
            if (!item) {
                start = start.parentElement;
                continue;
            }
            const [host, node] = item;
            if (!host.tooltip) {
                host.tooltip = new CancelToken();
                const reset = () => delete host.tooltip;

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

                TooltipControl.show(
                    start,
                    XNode.create(TooltipControl as any, {}),
                    {
                        cancelToken: host.tooltip,
                        alignment: "topRight"
                    }
                    ).then(reset, reset) ;
            }
            break;
        }

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
