import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomRepeater from "../../../basic/AtomRepeater";
import { SwipeLeft } from "../../../basic/Swipe";

const css = CSS(StyleRule()
    .nested(StyleRule("[data-swipe] > *")
        .paddingLeft(10)
        .paddingRight(10)
        .margin(5)
        .borderRadius(10)
        .and(StyleRule(":not(*:first-child)")
            .minWidth(50)
            .backgroundColor(Colors.blue)
            .color(Colors.white)
        )
        .and(StyleRule(":first-child")
            .backgroundColor(Colors.whiteSmoke)
        )
    )
);

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
