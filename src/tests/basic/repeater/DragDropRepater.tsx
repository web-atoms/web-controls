import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomRepeater from "../../../basic/AtomRepeater";

const images1 = [1, 2, 3, 4];
const images2 = [5, 6, 7, 8];

const renderer = (item) => <div
    draggable={true}
    style-margin="5px"
    style-padding="5px"
    style-border-radius="5px"
    style-background={Colors.white}>
    <div
        draggable={true}
        style-margin="5px"
        style-padding="5px"
        style-border-radius="5px"
        style-background={Colors.lightYellow}
        style-font-size="20px"
        text={item}
        />
</div>;

@Pack
export default class DragDropRepeater extends AtomControl {

    protected create(): void {
        this.render(<div style-background-color={Colors.lightGray}>
            <AtomRepeater
                enableDragDrop={true}
                items={images1} itemRenderer={renderer}/>
            <AtomRepeater
                enableDragDrop={true}
                items={images2} itemRenderer={renderer}/>
        </div>);
    }

}
