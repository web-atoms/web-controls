import { App } from "@web-atoms/core/dist/App";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl, ElementValueSetters } from "@web-atoms/core/dist/web/controls/AtomControl";
import { IPopupOptions, PopupControl } from "@web-atoms/core/dist/web/services/PopupService";

export interface IInlinePopupOptions extends IPopupOptions {
    cancelOnClick?: boolean;
}

export default class InlinePopupControl extends PopupControl {

    public static showPopup<T>(opener: HTMLElement | AtomControl, popup: XNode, options: IInlinePopupOptions = {}) {
        const c = class extends InlinePopupControl {
            protected create() {
                this.render(popup);
            }

            protected dispatchClickEvent(e: MouseEvent, data: any) {
                let start = this.element.parentElement;
                while (start) {
                    const { atomControl } = start;
                    if (atomControl) {
                        (atomControl as any).dispatchClickEvent(e, data);
                        if (options?.cancelOnClick) {
                            this.cancel();
                        }
                        return;
                    }
                    start = start.parentElement;
                }
                super.dispatchClickEvent(e, data);
            }
        };
        return c.showControl(opener, options);
    }

}