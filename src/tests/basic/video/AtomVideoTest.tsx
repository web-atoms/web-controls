import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomVideoPlayer from "../../../player/AtomVideoPlayer";

import "./AtomVideoTest.local.less";
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