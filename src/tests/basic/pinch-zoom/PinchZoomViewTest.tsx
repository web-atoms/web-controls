import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import PinchZoomView from "../../../basic/PinchZoomView";

let meta = document.head.querySelector("meta[name=viewport]") as HTMLMetaElement;
if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
}

meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";

const isMobile = window.innerHeight > window.innerWidth;

// tslint:disable-next-line: max-line-length
const url = "https://test-gush.azureedge.net/photos/size(2000)/files/tfs/14171/9ccc415481024aabbc9c0bc3b4efc831/meritt-thomas-MQ9U2GFnnDc-unsplash.jpg/meritt-thomas-MQ9U2GFnnDc-unsplash.2000.jpg";

const css = CSS(StyleRule()
    .absolutePosition( isMobile
        ? {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }
        : {
        left: 50,
        top: 50,
        width: 600,
        height: 600
    })
    .display("grid")
    .alignItems("stretch")
    .justifyItems("stretch")
);

@Pack
export default class PinchZoomViewTest extends AtomControl {

    protected create() {
        this.render(<div class={css}>
            <PinchZoomView
                source={url}
                />
        </div>);
    }

}
