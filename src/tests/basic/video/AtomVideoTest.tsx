import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomVideoPlayer from "../../../player/AtomVideoPlayer";


const css = CSS(StyleRule()
    .absolutePosition({ left: 50, right: 50, top: 50, bottom: 50})
    .child(StyleRule("[data-video-player]")
        .maximizeAbsolute()
    )
);

@Pack
export default class AtomVideoTest extends AtomControl {

    protected create(): void {
        this.render(<div class={css}>
            <AtomVideoPlayer
                source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                />        
        </div>)
    }

}