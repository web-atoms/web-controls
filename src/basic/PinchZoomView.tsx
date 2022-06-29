import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode, { isTemplateSymbol } from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

CSS(StyleRule()
    .overflow("auto")
    .child(StyleRule(".image-container")
        .overflow("hidden")
        .display("grid")
        .alignItems("center")
        .justifyItems("center")
        .justifyContent("center" as any)
    )
    .child(StyleRule(".spinner")
        .maximizeAbsolute()
        .textAlign("center")
        .verticalAlign("middle")
    )
    , "div[data-pinch-zoom]"
);

export interface IZoom {
    anchorX: number;
    anchorY: number;
    scale: number;
}

export default class PinchZoomView extends AtomControl {

    @BindableProperty
    public zoom: IZoom;

    @BindableProperty
    public source: string;

    @BindableProperty
    private loading: boolean;

    private image: HTMLImageElement;

    private imageContainer: HTMLDivElement;

    protected preCreate() {

        this.loading = false;
        this.zoom = {
            scale: 0,
            anchorX: 0,
            anchorY: 0
        };

        this.element.dataset.pinchZoom = "true";

        const pointers: PointerEvent[] = [];
        let pinchDistance = 0;

        const element = this.element;

        const pointerMove = (ev: PointerEvent) => {
            ev.preventDefault();
            ev.stopImmediatePropagation?.();
            const target = ev.target as HTMLElement;

            const index = pointers.findIndex((e) => e.pointerId === ev.pointerId);
            pointers[index === -1 ? pointers.length : index] = ev;

            if (pointers.length === 2) {
                const [first, last] = pointers;
                const diffX = first.offsetX - last.offsetX;
                const diffY = first.offsetY - last.offsetY;
                const anchorX = (first.offsetX + last.offsetX) / 2;
                const anchorY = (first.offsetY + last.offsetY) / 2;
                const distance = Math.sqrt( (diffX * diffX) + (diffY * diffY) );
                if (pinchDistance !== distance) {
                    pinchDistance = distance;
                    this.updateZoom({
                        anchorX,
                        anchorY,
                        scale: distance
                    });
                }
                return;
            }

            // enable panning...
        };

        function pointerUp(ev: PointerEvent) {
            pointers.remove((i) => i.pointerId === ev.pointerId);
            if (pointers.length === 0) {
                element.removeEventListener("pointermove", pointerMove);
                element.removeEventListener("pointerup", pointerUp);
            }
        }

        this.bindEvent(this.element, "pointerdown", (ev: PointerEvent) => {
            const target = ev.target as HTMLElement;
            ev.preventDefault();
            ev.stopImmediatePropagation?.();
            for (const iterator of pointers) {
                if (iterator.pointerId === ev.pointerId) {
                    return;
                }
            }
            if (pointers.length === 0) {
                element.addEventListener("pointermove", pointerMove);
                element.addEventListener("pointerup", pointerUp);
            }
            pointers.push(ev);
        } );

        this.bindEvent(this.element, "wheel", (ev: WheelEvent) => {

            const newScale = this.zoom.scale - (ev.deltaY < 0 ? -10 : 10);
            // console.log(ev);

            const anchorX = ev.offsetX;
            const anchorY = ev.offsetY;
            this.updateZoom({
                anchorX,
                anchorY,
                scale: newScale
            });

            ev.preventDefault();
            ev.stopImmediatePropagation?.();
        });

        this.render(<div>
            <div class="image-container">
                <img
                    src={Bind.oneWay(() => this.getSource(this.source))}
                    event-load={() => {
                        this.loading = false;
                        this.updateZoom(this.zoom);
                    }}
                    />
            </div>
            <i class={Bind.oneWay(() => this.loading ? "spinner fa-duotone fa-spinner fa-spin" : "hide")}/>
        </div>);
        this.imageContainer = this.element.firstElementChild as HTMLDivElement;
        this.image = this.imageContainer.firstElementChild as HTMLImageElement;
    }

    private getSource(text: string) {
        if (text) {
            this.loading = true;
        }
        return text;
    }

    private updateZoom(zoom: IZoom) {
        const { anchorX, anchorY, scale } = zoom;
        this.zoom = zoom;
        const image = this.image;
        if (!image.naturalHeight) {
            return;
        }
        const maxHeight = this.element.clientWidth > this.element.clientHeight;
        const s = maxHeight
            ? this.element.clientWidth / image.naturalWidth
            : this.element.clientHeight / image.naturalHeight ;
        if (scale <= 0) {
            // this.image.style.transformOrigin = "0,0";
            // this.image.style.transform = `scale(${s})`;
            this.image.style.maxWidth = this.element.clientWidth + "px";
            this.image.style.maxHeight = this.element.clientHeight + "px";
            return;
        }
    }
}
