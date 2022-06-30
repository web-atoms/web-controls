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
        .display("inline-grid")
        .alignItems("center")
        .justifyItems("center")
    )
    .child(StyleRule(".hide")
        .display("none")
    )
    , "div[data-pinch-zoom]"
);

const center = (ev: TouchEvent) => {
    const touch = ev.touches[0];
    if (touch) {
        return {
            x: touch.clientX,
            y: touch.clientY
        }
    }
    return {
        x: 0,
        y: 0
    };
}

const distance = (first: Touch, second: Touch) => {
    return Math.hypot(first.pageX - second.pageX, first.pageY - second.pageY);
};

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
                class={Bind.oneWay(() => this.zoom.scale ? "scale fa-solid fa-arrows-minimize" : "hide")}
                title="Display entire image"/>
        </div>);
        this.imageContainer = this.element.firstElementChild as HTMLDivElement;
        this.image = this.imageContainer.firstElementChild as HTMLImageElement;

        const scrollView = this.element;

        let previous: {x: number, y: number};

        let touchMoveDisposable;
        let touchEndDisposable;

        this.bindEvent(scrollView, "touchstart", (evs: TouchEvent) => {
            previous = center(evs);
            // evs.preventDefault();
            // evs.stopImmediatePropagation?.();

            // const start = this.zoom.scale;

            let previousDistance = undefined;
            

            touchMoveDisposable ??= this.bindEvent(scrollView, "touchmove", (ev: TouchEvent) => {
                ev.preventDefault();
                ev.stopImmediatePropagation?.();

                let { x, y, anchorX, anchorY, scale } = this.zoom;

                if (ev.touches.length === 2) {
                    const rect = this.element.getBoundingClientRect();
                    const first = ev.touches[0];
                    const second = ev.touches[1];
                    anchorX = ((first.clientX + second.clientX) / 2) - rect.left;
                    anchorY = ((first.clientY + second.clientY) / 2) - rect.top;
                    const newScale = distance(first, second);
                    if (previousDistance === void 0) {
                        previousDistance = newScale;
                        return;
                    }
                    if (previousDistance === newScale) {
                        return;
                    }
                    scale = previousDistance > newScale
                        ? previousDistance - newScale
                        : previousDistance + newScale;
                    this.updateZoom({
                        anchorX,
                        anchorY,
                        x,
                        y,
                        scale
                    });
                    
                    return;
                }

                if (!previous) {
                    return;
                }
                // enable panning...
                const cp = center(ev);
                x += (cp.x - previous.x);
                y += (cp.y - previous.y);
                previous = cp;
                this.updateZoom({
                    anchorX,
                    anchorY,
                    x,
                    y,
                    scale
                });

            });

            touchEndDisposable ??= this.bindEvent(scrollView, "touchend", (ev: TouchEvent) => {
                // ev.preventDefault();
                // ev.stopImmediatePropagation?.();

                touchMoveDisposable?.dispose();
                touchEndDisposable?.dispose();
                touchMoveDisposable = undefined;
                touchEndDisposable = undefined;
                previousDistance = undefined;
            });
        });

        let mouseMoveDisposable;
        let mouseUpDisposable;

        this.bindEvent(scrollView, "mousedown", (ev: MouseEvent) => {
            this.element.dataset.state = "grabbing";
            previous = {
                x: ev.clientX,
                y: ev.clientY
            };

            mouseMoveDisposable ??= this.bindEvent(scrollView, "mousemove", (e: MouseEvent) => {
                e.preventDefault();
                e.stopImmediatePropagation?.();
                const { anchorX, anchorY, scale } = this.zoom;
                let {x , y } = this.zoom;
                const cp = { x: e.clientX, y: e.clientY };
                x += (cp.x - previous.x);
                y += (cp.y - previous.y);
                previous = cp;
                this.updateZoom({
                    anchorX,
                    anchorY,
                    x,
                    y,
                    scale
                });
                    
            });
            mouseUpDisposable ??= this.bindEvent(scrollView, "mouseup", (e: MouseEvent) => {
                e.preventDefault();
                e.stopImmediatePropagation?.();

                this.element.dataset.state = "";
                previous = null;
                mouseMoveDisposable.dispose();
                mouseUpDisposable.dispose();
                mouseMoveDisposable = undefined;
                mouseUpDisposable = undefined;
            });

        });

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
