import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { ChildEnumerator } from "@web-atoms/core/dist/web/core/AtomUI";
import { installInputRangeStyle } from "./input-range-style";
import styled from "@web-atoms/core/dist/style/styled";

// check if it is a mobile..
const isTouchEnabled = /android|iPhone|iPad/i.test(navigator.userAgent);

    styled.css `

    display: grid;
    grid-template-rows: auto 1fr auto auto auto;
    grid-template-columns: auto 1fr auto;
    overflow: hidden;

    & > [data-element=banner] {

        grid-row-start: 3;
        grid-row-end: span 3;
        grid-column-start: 1;
        grid-column-end: span 3;

        align-self: end;
        justify-self: center;
        height: 15%;

        gap: 5px;

        overflow: hidden;

        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;

        background-color: black;
        color: white;

        border-radius: 10px;

        padding: 10px;

        align-items: center;
        justify-items: stretch;
        z-index: 2;

        display: none;

        &[data-has-logo=true] {
            display: grid;
        }

        & > * {
            min-height: 0;
            min-width: 0;
        }

        & > [data-element=logo] {
            grid-row: 1 / span 2;
            grid-column: 1;
            z-index: 2;
            height: 100%;
        }

        & > [data-element=logo-title] {
            grid-row-start: 1;
            grid-column-start: 2;
            z-index: 2;
            font-weight: bold;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        & > [data-element=logo-description] {
            grid-row-start: 2;
            grid-column-start: 2;
            z-index: 2;
            font-size: smaller;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    & > [data-element=video], & > [data-element=poster] {
        grid-row-start: 1;
        grid-row-end: span 5;
        grid-column-start: 1;
        grid-column-end: span 3;
        align-self: stretch;
        justify-self: stretch; 
    }
    
    & > [data-element=play-element] {
        z-index: 10;
        grid-row-start: 1;
        grid-row-end: span 5;
        grid-column-start: 1;
        grid-column-end: span 3;
        align-self: center;
        justify-self: center;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 4px;
        display: flex; 

        & > button.play {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            background-color: #0000ff;
            border-radius: 9999px;
            font-size: 25px;
            padding: 10px;
            width: 50px;
            height: 50px;
            text-align: center;
            vertical-align: middle; 
            & > i {
                margin-left: 4px; 
            }
        }
    }

    & > [data-element=progress] {
        z-index: 11;
        grid-row-start: 4;
        grid-column-start: 1;
        grid-column-end: span 3;
        align-self: flex-end;
        height: 15px;
        padding-top: 5px;
        padding-bottom: 5px;
        justify-self: stretch;
        background-color: rgba(0,0,0,0.3);
        width: 100%;
        cursor: pointer; 
    }
    
    & > [data-element=toolbar] {
        z-index: 10;
        grid-row-start: 5;
        grid-column-start: 1;
        grid-column-end: span 3;
        background-color: rgba(0,0,0,0.3);
        color: #ffffff;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        display: flex; 

        & > * {
            min-width: 20px;
            margin-left: 5px;
            padding: 5px; 
        }
        
        & > [data-style=button] {
            width: 30px;
            height: 30px;
            padding: 5px; 
        }
        
        & > [data-font-size=small] {
            font-size: x-small; 
        }
        
        & > [data-element=volume-range] {
            height: 2px;
            color: #008000;
            box-shadow: none;
            border: none; 
        }
        
        & > [data-element=volume-range]:focus {
            box-shadow: none;
            border: none; 
        }
        
        & > [data-element=full-screen] {
            margin-left: auto; 
        }
                
    }

    &[data-controls=true] {
        & > [data-element=toolbar] {
            display: flex; 
        }
        
        & > [data-element=progress] {
            display: flex; 
        }
    }

    &[data-state=playing] {
        &[data-controls=false] {
            & > [data-element=play-element], & > [data-element=progress], & > [data-element=toolbar] {
                display: none;
            }
        }
    }

    &[data-state=waiting] {
        &[data-controls=false] {
            & > [data-element=toolbar], & > [data-element=progress] {
                display: none;
            }
        }

        & > [data-element=toolbar] {
            & > [data-element=play] {
                display: none;
            }
        }

        & > [data-element=play-element] {
            display: none;
        }
    }
    
    &[data-state=paused] {
        & > [data-element=toolbar] {
            & > [data-element-pause] {
                display: none; 
            }
        }
    }
    
    `.installGlobal("[data-video-player=video-player]");

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

export type playerState = "playing" | "paused" | "ended" | "waiting" | "aborted" | "none";

const getPlayIcon = (state: playerState) => {
    switch(state) {
        case "ended":
            return "fa-solid fa-refresh";
        case "paused":
            return "fa-solid fa-play";
        case "playing":
            return "fa-solid fa-pause";
    }
    return "fa-solid fa-play";
};

export default class AtomVideoPlayer extends AtomControl {

    @BindableProperty
    public source: any;

    @BindableProperty
    public logo: any;

    @BindableProperty
    public logoTitle: string;

    @BindableProperty
    public logoDescription: string;

    public get poster() {
        return this.video.poster;
    }

    public set poster(v: string) {
        this.video.poster = v;
    }

    /**
     * Use this inside a mobile app
     */
    public useStageView: boolean;

    public get state() {
        return this.element.getAttribute("data-state") as playerState;
    }
    public set state(v: playerState) {
        this.element.setAttribute("data-state", v);
        AtomBinder.refreshValue(this, "paused");
        AtomBinder.refreshValue(this, "state");
    }

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
        return (document.fullscreenEnabled && this.element === document.fullscreenElement) ?? false;
    }

    private video: HTMLVideoElement;

    private progress: HTMLCanvasElement;

    private currentTimeSpan: HTMLSpanElement;
    private soundIcon: HTMLElement;
    private volumeRange: HTMLInputElement;

    private maxWidth: string = "";

    public stopFullscreen() {
        if(this.isFullScreen) {
            return document.exitFullscreen();
        }
        return Promise.resolve();
    }

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

                if (this.state === "playing") {
                    if (e.target === this.video) {
                        if (this.element.dataset.controls === "true") {
                            this.element.dataset.controls = "false";
                        } else {
                            this.element.dataset.controls = "true";
                        }
                        return;
                    }
                }

                if ((e.target as HTMLCanvasElement).tagName === "CANVAS") {
                    return;
                }
                // if (e.target === e.currentTarget) {
                //     if (this.element.dataset.controls === "true") {
                //         this.element.dataset.controls = "false";
                //     } else {
                //         this.element.dataset.controls = "true";
                //     }
                //     return;
                // }
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

            if (!this.element.requestFullscreen) {
                (this.video as any).webkitEnterFullscreen();
                return;
            }

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
            <div
                data-has-logo={Bind.oneWay(() => this.logo ? "true" : "false", "false")}
                data-element="banner"
                style-width={Bind.oneWay(() => this.maxWidth)}>
                <img
                    data-element="logo"
                    src={Bind.oneWay(() => this.logo)}/>
                <div
                    data-element="logo-title" text={Bind.oneWay(() => this.logo && this.logoTitle)}/>
                <div
                    data-element="logo-description" text={Bind.oneWay(() => this.logo && this.logoDescription)}/>
            </div>
            <video
                event-abort={() => this.state = "aborted"}
                event-durationchange={(e: Event) => AtomBinder.refreshValue(this, "duration")}
                event-ended={async (e: Event) => {
                    this.state = "ended";
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
                    const { video } = this;
                    const { videoWidth, videoHeight } = video;
                    const eW = video.offsetWidth * videoHeight / videoWidth;
                    const maxWidth = (100*(this.element.offsetWidth - eW) / this.element.offsetWidth); 
                    if (maxWidth > 50 && maxWidth < 100) {
                        this.maxWidth = `${maxWidth}%`;
                    }

                    AtomBinder.refreshValue(this, "duration");
                }}
                event-pause={() => this.state = "paused"}
                event-play={() => this.state = "playing"}
                event-progress={() => this.updateProgress()}
                event-timeupdate={() => {
                    this.currentTimeSpan.textContent = durationText(this.time, this.duration);
                    this.state = "playing";
                    this.updateProgress();
                    AtomBinder.refreshValue(this, "time");
                }}
                event-waiting={() => this.state = "waiting"}
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
                    class={ Bind.oneWay(() => getPlayIcon(this.state))}/>
                <i
                    data-click-event="volume"
                    data-style="button"
                    data-element="sound"
                    class="fa-duotone fa-volume-slash"/>
                { !isTouchEnabled && <input
                    data-click-event="none"
                    data-element="volume-range"
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    /> }
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
                data-click-event="toggle-play"
                data-element="play-element">
                <button class="play">
                    <i class={ Bind.oneWay(() => getPlayIcon(this.state))}/>
                </button>
            </div>
        </div>);

        const all = gatherElements(this.element) as any;
        this.video = all.video;
        this.progress = all.progress;
        this.currentTimeSpan = all.current;
        this.soundIcon = all.sound;
        this.volumeRange = all.volumeRange;
        if (this.volumeRange) {
            this.bindEvent(this.volumeRange, "input", () => {
                setTimeout(() => {
                    this.video.volume = parseFloat(this.volumeRange.value);
                }, 1);
            });
        }
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
            this.soundIcon.title = "Unmute";
            if (this.volumeRange) {
                this.volumeRange.style.display = "none";
            }
            return;
        }
        const audio = this.video.volume;
        if (this.volumeRange) {
            this.volumeRange.style.display = "";
            this.volumeRange.value = audio?.toString();
        }
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
