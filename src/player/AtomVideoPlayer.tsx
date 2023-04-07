import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { ChildEnumerator } from "@web-atoms/core/dist/web/core/AtomUI";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import { installInputRangeStyle } from "./input-range-style";

// check if it is a mobile..
const isTouchEnabled = /android|iPhone|iPad/i.test(navigator.userAgent);

CSS(StyleRule()
    .display("grid")
    .gridTemplateRows("auto 1fr auto")
    .gridTemplateColumns("auto 1fr auto auto")
    .backgroundColor(Colors.black)
    .child(StyleRule("[data-element=video]")
        .gridRowStart("1")
        .gridRowEnd("span 3")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .alignSelf("stretch")
        .justifySelf("stretch")
    )
    .child(StyleRule("[data-element=play-element]")
        .gridRowStart("1")
        .gridRowEnd("span 3")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .alignSelf("center")
        .justifySelf("center")
        .flexLayout({ justifyContent: "center"})
        .child(StyleRule("button.play")
            .display("inline-flex")
            .alignItems("center")
            .justifyContent("center")
            .color(Colors.white)
            .backgroundColor(Colors.blue)
            .borderRadius(9999)
            .fontSize(25)
            .padding(10)
            .width(50)
            .height(50)
            .textAlign("center")
            .verticalAlign("middle")
            .child(StyleRule("i")
                .marginLeft(4)
            )
        )
    )
    .child(StyleRule("[data-element=progress]")
        .zIndex("11")
        .gridRowStart("2")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .alignSelf("flex-end")
        .height( isTouchEnabled ? 50 : 15)
        .paddingTop(isTouchEnabled ? 20 : 5)
        .paddingBottom(isTouchEnabled ? 20 : 5)
        .justifySelf("stretch" as any)
        .backgroundColor(Colors.black.withAlphaPercent(0.3))
        .width("100%")
        .cursor("pointer")
    )
    .child(StyleRule("[data-element=toolbar]")
        .zIndex("10")
        .gridRowStart("3")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .backgroundColor(Colors.black.withAlphaPercent(0.3))
        .color(Colors.white)
        .flexLayout({
            justifyContent: "flex-start"
        })
        .child(StyleRule("*")
            .minWidth(20)
            .marginLeft(5)
            .padding(5)
        )
        .child(StyleRule("[data-style=button]")
            .width(20)
        )
        .child(StyleRule("[data-font-size=small]")
            .fontSize("x-small")
        )
        .child(StyleRule("[data-element=volume-range]")
            .height(2)
            .color(Colors.green)
            .boxShadow("none")
            .border("none")
            .focus(StyleRule()
                .boxShadow("none")
                .border("none")
            )
        )
        .child(StyleRule("[data-element=full-screen]")
            .marginLeft("auto")
            .marginRight(5)
        )
    )
    .and(StyleRule("[data-controls=true]")
        .child(StyleRule("[data-element=toolbar]")
            .display("flex")
        )
        .child(StyleRule("[data-element=progress]")
            .display("flex")
        )
    )
    .and(StyleRule("[data-state=pause]")
        .child(StyleRule("[data-element=toolbar]")
            .display("flex")
        )
        .child(StyleRule("[data-element=toolbar]")
            .child(StyleRule("[data-element=pause]")
                .display("none")
            )
        )
    )
    .and(StyleRule("[data-state=play]")
        .child(StyleRule("[data-element=play-element]")
            .display("none")
        )
        .child(StyleRule("[data-element=toolbar]")
            .child(StyleRule("[data-element=play]")
                .display("none")
            )
        )
        .and(StyleRule("[data-controls=false]")
            .child(StyleRule("[data-element=toolbar]")
                .display("none")
            )
            .child(StyleRule("[data-element=progress]")
                .display("none")
            )
        )
    )
    .and(StyleRule("[data-state=waiting]")
        .child(StyleRule("[data-element=play-element]")
            .display("none")
        )
        .child(StyleRule("[data-element=toolbar]")
            .child(StyleRule("[data-element=play]")
                .display("none")
            )
        )
        .and(StyleRule("[data-controls=false]")
            .child(StyleRule("[data-element=toolbar]")
                .display("none")
            )
            .child(StyleRule("[data-element=progress]")
                .display("none")
            )
        )
    )
, "*[data-video-player=video-player]");

const gatherElements = (e: HTMLElement, data = {}) => {
    const ce = ChildEnumerator.enumerate(e);
    for (const iterator of ce) {
        const elementName = iterator.dataset.element?.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        if (elementName) {
            data[elementName] = iterator;
        }
        gatherElements(iterator, data);
    }
    return data;
};

const numberToText = (n: number) => {
    if (n < 10) {
        return "0" + n;
    }
    return n.toString();
};

const durationText = (n: number, total: number) => {
    if (n === null || n === undefined) {
        return "";
    }
    const minutes = Math.floor(n / 60);
    const seconds = numberToText(Math.ceil(n % 60));
    const totalMinutes = Math.floor(total / 60);
    const totalSeconds = numberToText(Math.ceil(total % 60));
    return `${minutes}:${seconds} / ${totalMinutes}:${totalSeconds}`;
};

const noSoundIcon =  "fa-duotone fa-volume-slash";
const mute = "fa-duotone fa-volume-xmark";
const low = "fa-duotone fa-volume-low";
const mid = "fa-duotone fa-volume";
const high = "fa-duotone fa-volume-high";

export default class AtomVideoPlayer extends AtomControl {

    @BindableProperty
    public source: any;

    public get duration() {
        return this.video.duration;
    }

    public get time() {
        return this.video.currentTime;
    }
    public set time(v) {
        this.video.currentTime = v;
    }

    public get paused() {
        return this.video.paused;
    }

    public get isFullScreen() {
        return document.fullscreenEnabled && this.element === document.fullscreenElement;
    }

    private video: HTMLVideoElement;

    private progress: HTMLCanvasElement;

    private poster: HTMLImageElement;

    private currentTimeSpan: HTMLSpanElement;
    private soundIcon: HTMLElement;
    private volumeRange: HTMLInputElement;

    public pause() {
        this.video.pause();
    }

    public play() {
        // tslint:disable-next-line: no-console
        this.video.play().catch(console.error);
    }

    public onPropertyChanged(name: keyof AtomVideoPlayer): void {
        switch (name) {
            case "source":
                this.updateSource();
                break;
        }
    }

    protected setCurrentTime(n: number) {
        // n = Math.round(n * 100) / 100;
        this.video.currentTime = n * this.video.duration;
    }

    protected create(): void {
        this.element.dataset.videoPlayer = "video-player";
        this.bindEvent(this.element, "togglePlay", (e: CustomEvent) => {
            if (e.defaultPrevented) {
                return;
            }
            e.preventDefault();
            if (isTouchEnabled) {
                if ((e.target as HTMLCanvasElement).tagName === "CANVAS") {
                    return;
                }
                if (e.target === e.currentTarget) {
                    if (this.element.dataset.controls === "true") {
                        this.element.dataset.controls = "false";
                    } else {
                        this.element.dataset.controls = "true";
                    }
                    return;
                }
            }

            if (this.video.paused) {
                this.video.play();
                this.element.dataset.controls = "false";
            } else {
                this.video.pause();
                this.element.dataset.controls = "true";
            }
        });
        this.bindEvent(this.element, "volume", (e: CustomEvent) => {
            this.video.muted = !this.video.muted;
            this.updateVolume();
        });
        this.bindEvent(this.element, "fullScreen", async (e: CustomEvent) => {
            if (this.isFullScreen) {
                await document.exitFullscreen();
                return;
            }
            await this.element.requestFullscreen({navigationUI: "show" });
        });
        this.bindEvent(document as any, "fullscreenchange", () => {
            AtomBinder.refreshValue(this, "isFullScreen");
        });
        this.render(<div
            data-click-event="toggle-play"
            data-state="pause">
            <video
                event-abort={() => this.element.dataset.state = "abort"}
                event-durationchange={(e: Event) => AtomBinder.refreshValue(this, "duration")}
                event-ended={async (e: Event) => {
                    this.element.dataset.state = "ended";
                    if (document.fullscreenEnabled && this.element === document.fullscreenElement) {
                        await document.exitFullscreen();
                    }
                    e.target.dispatchEvent(new CustomEvent("videoEnded", { bubbles: true }));
                }}
                event-loadedmetadata={() => {
                    // this.duration = this.video.duration;
                    this.updateVolume();
                    this.currentTimeSpan.textContent = durationText(0, this.duration);
                    this.updateProgress();
                    AtomBinder.refreshValue(this, "duration");
                }}
                event-pause={() => this.element.dataset.state = "pause"}
                event-play={() => this.element.dataset.state = "play"}
                event-progress={(e) => this.updateProgress()}
                event-timeupdate={() => {
                    this.currentTimeSpan.textContent = durationText(this.time, this.duration);
                    this.element.dataset.state = "play";
                    this.updateProgress();
                    AtomBinder.refreshValue(this, "time");
                }}
                event-waiting={() => this.element.dataset.state = "waiting"}
                event-volumechange={() => this.updateVolume()}
                autoplay={false}
                playsInline={true}
                style-max-width="100%"
                style-max-height="100%"
                data-element="video"/>
            <canvas
                data-element="progress"
                />
            <img data-element="poster"/>
            <div data-element="toolbar">
                <i
                    data-element="play"
                    data-style="button"
                    class="fa-solid fa-play"/>
                <i
                    data-element="pause"
                    data-style="button"
                    class="fa-solid fa-pause"/>
                <i
                    data-click-event="volume"
                    data-style="button"
                    data-element="sound"
                    class="fa-duotone fa-volume-slash"></i>
                <input
                    data-click-event="none"
                    data-element="volume-range"
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    />
                <span
                    data-font-size="small"
                    data-element="current" text="0:00"/>
                <i
                    data-click-event="full-screen"
                    data-style="button"
                    data-element="full-screen"
                    class={Bind.oneWay(() => this.isFullScreen
                        ? "fa-solid fa-compress" :
                        "fa-solid fa-expand")}></i>
            </div>
            <div
                data-element="play-element">
                <button class="play">
                    <i class="fa-solid fa-play"/>
                </button>
            </div>
        </div>);

        const all = gatherElements(this.element) as any;
        this.video = all.video;
        this.progress = all.progress;
        this.currentTimeSpan = all.current;
        this.soundIcon = all.sound;
        this.volumeRange = all.volumeRange;
        this.bindEvent(this.volumeRange, "input", () => {
            setTimeout(() => {
                this.video.volume = parseFloat(this.volumeRange.value);
            }, 1);
        });
        this.bindEvent(this.element, "mouseenter", () => {
            this.element.dataset.controls = "true";
        });
        this.bindEvent(this.element, "mouseleave", () => {
            this.element.dataset.controls = "false";
        });
        this.bindEvent(this.progress, "pointerdown", (e: PointerEvent) => {
            e.preventDefault();
            // const scale = this.progress.clientWidth / this.video.duration ;
            this.setCurrentTime(e.offsetX / this.progress.clientWidth);

            const move = (e1: PointerEvent) => {
                e1.preventDefault();
                this.setCurrentTime(e1.offsetX / this.progress.clientWidth);
            };

            const up = (e1: PointerEvent) => {
                e1.preventDefault();
                this.progress.removeEventListener("pointermove", move);
                this.progress.removeEventListener("pointerup", up);
            };

            this.progress.addEventListener("pointermove", move);
            this.progress.addEventListener("pointerup", up);
        });
    }

    protected updateSource() {
        this.video.src = this.source;
    }

    private updateProgress() {
        const context = this.progress.getContext("2d");
        // context.fillStyle = "rgba(0,0,0,0)";
        context.strokeStyle = "rgba(0,0,0,0)";
        const width = this.progress.clientWidth;
        const height = this.progress.clientHeight;
        this.progress.width = width;
        this.progress.height = height;
        context.clearRect(0, 0, width, height);
        const max = this.video.duration;
        const seekable = this.video.buffered;
        const scale = width / max;
        context.fillStyle = "rgba(255,255,255,0.3)";
        context.fillRect(0, 0, width, height);
        context.fillStyle = "rgba(255,255,255,0.6)";
        for (let index = 0; index < seekable.length; index++) {
            const start = seekable.start(index) * scale;
            const end = seekable.end(index) * scale;
            context.fillRect(start, 0, end, height);
        }
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, this.video.currentTime * scale, height);
    }

    private updateVolume() {
        if (this.video.muted) {
            this.soundIcon.className = mute;
            this.volumeRange.style.display = "none";
            this.soundIcon.title = "Unmute";
            return;
        }
        const audio = this.video.volume;
        this.volumeRange.style.display = "";
        this.volumeRange.value = audio?.toString();
        this.soundIcon.title = "Mute";
        if (audio > 0.8) {
            this.soundIcon.className = high;
            return;
        }
        if (audio < 0.2) {
            this.soundIcon.className = low;
            return;
        }
        this.soundIcon.className = mid;
    }

}
