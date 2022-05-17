import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

CSS(StyleRule()
    .display("grid")
    .gridTemplateRows("auto 1fr auto")
    .gridTemplateColumns("auto 1fr auto auto")
    .child(StyleRule("[data-element=video]")
        .gridRowStart("1")
        .gridRowEnd("span 3")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
    )
    .child(StyleRule("[data-element=play-element]")
        .gridRowStart("1")
        .gridRowEnd("span 3")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
    )
    .and(StyleRule("[data-playing=true]")
        .child(StyleRule("[data-element=play-element]")
            .display("none")
        )
    )
, "*[data-video-player=video-player]");

export default class AtomVideoPlayer extends AtomControl {

    @BindableProperty
    public source: any;

    public duration: number;

    public time: number;

    private video: HTMLVideoElement;

    public onPropertyChanged(name: keyof AtomVideoPlayer): void {
        switch (name) {
            case "source":
                this.updateSource();
                break;
        }
    }

    protected create(): void {
        this.element.dataset.videoPlayer = "video-player";
        this.bindEvent(this.element, "itemClick", (e: CustomEvent) => {
            const dataElement = e.detail.element;
        });
        this.render(<div>
            <video
                event-abort={() => this.element.dataset.state = "abort"}
                event-durationchange={(e: Event) => this.duration = this.video.duration}
                event-ended={() => this.element.dataset.state = "ended"}
                event-loadedmetadata={() => this.duration = this.video.duration}
                event-pause={() => this.element.dataset.state = "pause"}
                event-play={() => this.element.dataset.state = "play"}
                event-progress={(e) => console.log(e)}
                event-timeupdate={() => this.time = this.video.currentTime}
                event-waiting={() => this.element.dataset.state = "waiting"}
                autoplay={false}
                data-element="video"/>
            <input
                data-element="progress"
                type="range"/>
            <img data-element="poster"/>
            <div data-element="play-element">
                <i class="fa-solid fa-circle-play"/>
            </div>
        </div>);
        this.video = this.element.children[0] as HTMLVideoElement;
    }

    protected updateSource() {
        this.video.src = this.source;
    }

}
