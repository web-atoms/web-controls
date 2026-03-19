import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import AtomVideoPlayer from "../../../player/AtomVideoPlayer.js";

import "./AtomVideoTest.local.css";
const css = "atom-video-test-local";

@Pack
export default class AtomVideoTest extends AtomControl {

    protected create(): void {
        this.render(<div class={css}>
            <AtomVideoPlayer
                logo="https://test.castyy.com/files/was/15242/25964cbc418f4692b9d58f95624a21ad/playstore.png"
                logoTitle="Castyy Demo Video"
                logoDescription="Big bunny high definition video"
                source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                />        
        </div>)
    }

}