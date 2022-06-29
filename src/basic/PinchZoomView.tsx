import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode, { isTemplateSymbol } from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

CSS(StyleRule()
    .position("relative")
    .overflow("hidden")
    .cursor("grab")
    .and(StyleRule("[data-state=grabbing]")
        .cursor("grabbing")
    )
    .child(StyleRule(".image-container")
        .maximizeAbsolute()
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
    x: number,
    y: number,
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
            anchorY: 0,
            x: 0,
            y: 0
        };

        this.element.dataset.pinchZoom = "true";

        const pointers: PointerEvent[] = [];
        let pinchDistance = 0;

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

        const scrollView = this.element;

        const pointerMove = (ev: PointerEvent) => {
            ev.preventDefault();
            ev.stopImmediatePropagation?.();
            const target = ev.target as HTMLElement;

            const index = pointers.findIndex((e) => e.pointerId === ev.pointerId);
            if (index === -1) {
                return;
            }

            const previous = pointers[index];
            pointers[index] = ev;

            let { x, y, anchorX, anchorY, scale } = this.zoom;

            if (pointers.length === 2) {
                const [first, last] = pointers;
                const diffX = first.offsetX - last.offsetX;
                const diffY = first.offsetY - last.offsetY;
                anchorX = (first.offsetX + last.offsetX) / 2;
                anchorY = (first.offsetY + last.offsetY) / 2;
                const scale = Math.sqrt( (diffX * diffX) + (diffY * diffY) );
                if (pinchDistance !== scale) {
                    pinchDistance = scale;
                    this.updateZoom({
                        anchorX,
                        anchorY,
                        x,
                        y,
                        scale
                    });
                }
                return;
            }

            // enable panning...
            x += 2 * (ev.offsetX - previous.offsetX);
            y += 2 * (ev.offsetY - previous.offsetY);
            this.updateZoom({
                anchorX,
                anchorY,
                x,
                y,
                scale
            })

        };

        function pointerUp(ev: PointerEvent) {
            const target = ev.currentTarget as HTMLElement;
            target.dataset.state = "";
            pointers.remove((i) => i.pointerId === ev.pointerId);
            if (pointers.length === 0) {
                scrollView.removeEventListener("pointermove", pointerMove);
                scrollView.removeEventListener("pointerup", pointerUp);
            }
        }

        this.bindEvent(scrollView, "pointerdown", (ev: PointerEvent) => {
            const target = ev.currentTarget as HTMLElement;
            ev.preventDefault();
            ev.stopImmediatePropagation?.();
            setTimeout(() => {
                this.element.dataset.state = "grabbing";
            }, 1);
            for (const iterator of pointers) {
                if (iterator.pointerId === ev.pointerId) {
                    return;
                }
            }
            if (pointers.length === 0) {
                scrollView.addEventListener("pointermove", pointerMove);
                scrollView.addEventListener("pointerup", pointerUp);
            }
            pointers.push(ev);
        } );

        this.bindEvent(scrollView, "wheel", (ev: WheelEvent) => {

            const target = ev.currentTarget;
            ev.preventDefault();
            ev.stopImmediatePropagation?.();

            const newScale = this.zoom.scale - (ev.deltaY < 0 ? -50 : 50);

            const anchorX = ev.offsetX;
            const anchorY = ev.offsetY;
            const { x, y } = this.zoom;
            this.updateZoom({
                anchorX,
                anchorY,
                x,
                y,
                scale: newScale < 0 ? 1 : newScale
            });

        }, undefined, {
            passive: false
        });
    }

    private getSource(text: string) {
        if (text) {
            this.loading = true;
        }
        return text;
    }

    private updateZoom(zoom: IZoom) {
        let { anchorX, anchorY, scale, x, y } = zoom;
        // console.log(zoom);
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
            scale = 0;
        }
        const newWidth = (this.element.clientWidth + scale) + "px";
        const newHeight = (this.element.clientHeight + scale) + "px";

        this.image.style.maxWidth = this.element.clientWidth + "px";
        this.image.style.maxHeight = this.element.clientHeight + "px";

        if (scale <= 0) {
            this.imageContainer.style.transform = "";
            return;
        }

        const clientWidth = this.element.clientWidth;
        const scaleFactor = (clientWidth + scale) / clientWidth;

        this.imageContainer.style.transformOrigin = `${anchorX*scaleFactor}px ${anchorY*scaleFactor}`;
        this.imageContainer.style.transform = `translate(${x}px, ${y}px) scale(${scaleFactor})`;
    }
}
