import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode, { isTemplateSymbol } from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";

import "./styles/zoom-view-style";

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

const findLargestDistance = (touches: TouchList) => {

    let pair = null as { t1: Touch, t2: Touch, distance: number};

    for (let i = 0; i < touches.length; i++) {
        const t1 = touches[i];
        for (let j = i + 1; j < touches.length; j++) {
            const t2 = touches[j];
            const distance = Math.hypot(t1.pageX - t2.pageX, t1.pageY - t2.pageY);
            if (pair === null) {
                pair = { t1, t2, distance };
                continue;
            }
            if (pair.distance < distance) {
                pair = { t1, t2, distance };
            }
        }
    }

    return pair;
};

export interface IZoom {
    anchorX: number;
    anchorY: number;
    x: number;
    y: number;
    scale: number;
}

export default class ZoomView extends AtomControl {

    @BindableProperty
    public zoom: IZoom;

    @BindableProperty
    public source: string;

    @BindableProperty
    private loading: boolean;

    private image: HTMLImageElement;

    private scrollDiv: HTMLDivElement;

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

        this.element.setAttribute("data-zoom-view", "zoom-view");

        this.element.draggable = false;

        this.render(<div>
            <div class="scroll">
                <img
                    class="image-container"
                    src={Bind.oneWay(() => this.getSource(this.source))}
                    style-opacity={Bind.oneWay(() => this.loading ? "0.3" : "1")}
                    event-load={() => {
                        this.loading = false;
                        this.updateZoom(this.zoom);
                    }}
                    />
            </div>
            <i class={Bind.oneWay(() => this.loading ? "spinner fa-duotone fa-spinner fa-spin" : "hide")}/>
            <i
                event-click={() => this.updateZoom()}
                class={Bind.oneWay(() => this.zoom.scale ? "scale" : "hide")}
                title="Display entire image"/>
        </div>);
        this.scrollDiv = this.element.firstElementChild as HTMLDivElement;
        this.imageContainer = this.scrollDiv.firstElementChild as HTMLDivElement;
        this.image = this.imageContainer as HTMLImageElement;

        const scrollView = this.element;

        let previous: {x: number, y: number};

        let touchMoveDisposable;
        let touchEndDisposable;

        this.bindEvent(scrollView, "touchstart", (evs: TouchEvent) => {

            previous = center(evs);
            let previousDistance = undefined;
            

            touchMoveDisposable ??= this.bindEvent(scrollView, "touchmove", (ev: TouchEvent) => {


                let { x, y, anchorX, anchorY, scale } = this.zoom;

                if (ev.touches.length > 1) {

                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                    
                    const rect = this.element.getBoundingClientRect();

                    const ld = findLargestDistance(ev.touches);

                    const first = ld.t1;
                    const second = ld.t2;
                    const newScale = ld.distance;
                    if (previousDistance === void 0) {
                        previousDistance = newScale;
                        return;
                    }
                    if (previousDistance === newScale) {
                        return;
                    }

                    anchorX = ((first.clientX + second.clientX) / 2) - rect.left;
                    anchorY = ((first.clientY + second.clientY) / 2) - rect.top;
                    scale += newScale - previousDistance;
                    previousDistance = newScale;
                    this.updateZoom({
                        anchorX,
                        anchorY,
                        x,
                        y,
                        scale
                    });
                    
                    return;
                }

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

        this.bindEvent(scrollView, "dragstart", (ev: DragEvent) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();
        });

        this.bindEvent(scrollView, "mousedown", (ev: MouseEvent) => {
            this.element.dataset.state = "grabbing";
            previous = {
                x: ev.clientX,
                y: ev.clientY
            };

            mouseMoveDisposable ??= this.bindEvent(scrollView, "mousemove", (e: MouseEvent) => {
                e.preventDefault();
                e.stopImmediatePropagation?.();
                const cp = { x: e.clientX, y: e.clientY };
                const diffX = previous.x - cp.x;
                const diffY = previous.y - cp.y;
                previous = cp;
                this.scrollDiv.scrollBy(diffX, diffY);
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

        const { clientWidth, clientHeight } = this.element;


        if (scale <= 0) {
            this.element.scrollTo(0,0);
            this.imageContainer.style.transform = ``;
            return;
        }

        const scaleFactor = (clientWidth + scale) / clientWidth;

        this.imageContainer.style.transformOrigin = `${anchorX}px ${anchorY}px`;
        this.imageContainer.style.transform = `scale(${scaleFactor})`;


        const e = this.imageContainer.getBoundingClientRect();
        // console.log([e.left, e.top]);
        const left = -e.left;
        const top = -e.top;
        this.imageContainer.style.transformOrigin = "0 0";
        const de = this.imageContainer.getBoundingClientRect();
        // console.log([de.left, de.top]);
        this.scrollDiv.scrollTo({ left: left + de.left, top: top + de.top , behavior: "instant" });
    }
}
