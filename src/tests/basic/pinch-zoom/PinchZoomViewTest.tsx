import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import PinchZoomView from "../../../basic/PinchZoomView.js";

import "./PinchZoomViewTest.global.css";

let meta = document.head.querySelector("meta[name=viewport]") as HTMLMetaElement;
if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
}

meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
const isMobile = window.innerHeight > window.innerWidth;

import "./PinchZoomViewTest.global.css";


// tslint:disable-next-line: max-line-length
const url = "https://test-gush.azureedge.net/photos/size(2000)/files/tfs/14171/9ccc415481024aabbc9c0bc3b4efc831/meritt-thomas-MQ9U2GFnnDc-unsplash.jpg/meritt-thomas-MQ9U2GFnnDc-unsplash.2000.jpg";


@Pack
export default class PinchZoomViewTest extends AtomControl {

    protected create() {
        this.render(<div class="pinch-zoom-local-test">
            <PinchZoomView
                source={url}
                />
        </div>);
    }

}
