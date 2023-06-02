import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomRepeater from "../../../basic/AtomRepeater";
import { SwipeLeft } from "../../../basic/Swipe";
import styled from "@web-atoms/core/dist/style/styled";

const css = styled.css `

    & [data-swipe] > * {
        padding-left: 10px;
        padding-right: 10px;
        margin: 5px;
        border-radius: 10px; 
        &:not(*:first-child) {
            min-width: 50px;
            background-color: #0000ff;
            color: #ffffff; 
        }

        &:first-child {
            background-color: #f5f5f5; 
        }
    }
    
    `.installLocal();

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
