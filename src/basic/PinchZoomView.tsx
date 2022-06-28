import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode, { isTemplateSymbol } from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

CSS(StyleRule()
    .overflow("auto")
    ,"div[data-pinch-zoom]"
);

export default class PinchZoomView extends AtomControl {

    @BindableProperty
    public scale: number;

    protected preCreate() {
        
        this.scale = 1;

        this.element.dataset.pinchZoom = "true";

        const pointers: PointerEvent[] = [];
        let pinchDistance = 0;

        const element = this.element;

        function pointerMove(ev: PointerEvent) {
            const target = ev.target as HTMLElement;

            const index = pointers.findIndex((e) => e.pointerId === ev.pointerId);
            pointers[index === -1 ? pointers.length : index] = ev;
        
            if (pointers.length === 2) {
                const [first, last] = pointers;
                const diffX = first.clientX - last.clientX;
                const diffY = first.clientY - last.clientY;
                const distance = Math.sqrt( (diffX * diffX) + (diffY * diffY) );
                if (pinchDistance !== distance) {
                    pinchDistance = distance;
                    this.scale = distance;
                }
                return;
            }

            // enable panning...
        }
        
        function pointerUp(ev: PointerEvent) {
            pointers.remove((i) => i.pointerId === ev.pointerId);
            if (pointers.length === 0) {
                element.removeEventListener("pointermove", pointerMove);
                element.removeEventListener("pointerup", pointerUp);
            }
        }
        
        
        this.bindEvent(this.element, "pointerdown", (ev: PointerEvent) => {
            const target = ev.target as HTMLElement;
            if (!target.dataset.pinchZoom) {
                return;
            }
            for (const iterator of pointers) {
                if (iterator.pointerId === ev.pointerId) {
                    return;
                }
            }
            if (pointers.length === 0) {
                element.addEventListener("pointermove",pointerMove);
                element.addEventListener("pointerup",pointerUp);
            }
            pointers.push(ev);
        } );

        this.bindEvent(this.element, "wheel", (ev: WheelEvent) => {

            const newScale = this.scale + ev.deltaY;

            this.scale = newScale < 1 ? 1 : newScale;

            ev.preventDefault();
            ev.stopImmediatePropagation?.();
        });
    }
}