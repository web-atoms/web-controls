import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import ZoomView from "../../../basic/ZoomView";

import "./ZoomViewTest.local.less";

let meta = document.head.querySelector("meta[name=viewport]") as HTMLMetaElement;
if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
}

meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";

// tslint:disable-next-line: max-line-length
const url = "https://test-gush.azureedge.net/photos/size(2000)/files/tfs/14171/9ccc415481024aabbc9c0bc3b4efc831/meritt-thomas-MQ9U2GFnnDc-unsplash.jpg/meritt-thomas-MQ9U2GFnnDc-unsplash.2000.jpg";

@Pack
export default class ZoomViewTest extends AtomControl {

    protected create() {
        this.render(<div class="zoom-view-local-test">
            <ZoomView
                source={url}
                />
        </div>);
    }

}
