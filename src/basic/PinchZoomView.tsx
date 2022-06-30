import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
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
    .child(StyleRule(".scale")
        .absolutePosition({
            right: 10,
            top: 10
        })
        .border("solid 2px darkgray")
        .borderRadius(4)
        .backgroundColor(Colors.white)
        .padding(4)
        .color(Colors.black)
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
    x: number;
    y: number;
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

        this.element.title = "Use mouse wheel to zoom";

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
            <i
                event-click={() => this.updateZoom()}
                class={Bind.oneWay(() => this.zoom.scale ? "scale fa-solid fa-arrows-minimize" : "hide")}/>
        </div>);
        this.imageContainer = this.element.firstElementChild as HTMLDivElement;
        this.image = this.imageContainer.firstElementChild as HTMLImageElement;

        const scrollView = this.element;

        this.bindEvent(scrollView, "pointermove", (ev: PointerEvent) => {
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
                const [first, second] = pointers;
                const diffX = first.offsetX - second.offsetX;
                const diffY = first.offsetY - second.offsetY;
                anchorX = (first.offsetX + second.offsetX) / 2;
                anchorY = (first.offsetY + second.offsetY) / 2;
                scale = Math.sqrt( (diffX * diffX) + (diffY * diffY) );
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
            x += (ev.offsetX - previous.offsetX);
            y += (ev.offsetY - previous.offsetY);
            this.updateZoom({
                anchorX,
                anchorY,
                x,
                y,
                scale
            });

        });

        this.bindEvent(scrollView, "pointerup", (ev: PointerEvent) => {
            this.element.dataset.state = "";
            pointers.remove((i) => i.pointerId === ev.pointerId);
        });

        let last = 0;
        let lastEvent: PointerEvent = null;

        this.bindEvent(scrollView, "pointerdown", (ev: PointerEvent) => {
            ev.preventDefault();
            ev.stopImmediatePropagation?.();
            const now = Date.now();
            const diff = now - last;
            last = now;
            // console.log(diff);
            if (lastEvent && lastEvent.pointerId === ev.pointerId && diff < 500) {
                setTimeout(() => {
                    // reset..
                    this.updateZoom();
                }, 1);
            }
            lastEvent = ev;
            this.element.dataset.state = "grabbing";
            for (const iterator of pointers) {
                if (iterator.pointerId === ev.pointerId) {
                    return;
                }
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
                scale: newScale < 0 ? 0 : newScale
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

    private updateZoom(zoom: IZoom = {
        x: 0,
        y: 0,
        anchorX: 0,
        anchorY: 0,
        scale: 0
    }) {
        const { anchorX, anchorY, x, y } = zoom;
        let { scale } = zoom;
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

        this.imageContainer.style.transformOrigin = `${anchorX}px ${anchorY}`;
        this.imageContainer.style.transform = `translate(${x}px, ${y}px) scale(${scaleFactor})`;
    }
}
