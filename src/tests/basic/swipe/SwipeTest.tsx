import Colors from "@web-atoms/core/dist/core/Colors.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import AtomRepeater from "../../../basic/AtomRepeater.js";
import { SwipeLeft } from "../../../basic/Swipe.js";

import "./SwipeTest.local.css";

const css = "swipe-test-local";

@Pack
export default class SwipeTest extends AtomControl {

    protected create() {
        this.render(<div class={css}><AtomRepeater
            items={[1,2,3,4,5,6,7,8,9,10]}
            itemRenderer={(item) => <SwipeLeft>
                <div
                    text={item}></div>
                <div>A</div>
                <div>B</div>
            </SwipeLeft>}
            />
            </div>);
    }

}
