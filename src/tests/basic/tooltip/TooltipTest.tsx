import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import AtomRepeater from "../../../basic/AtomRepeater.js";
import Tooltip from "../../../basic/Tooltip.js";

class CustomTooltip extends Tooltip {
    init(data) {
        this.renderer =<span>This is <i class="fa-solid fa-user"/>
            <b>HTML</b> tooltip by <span text={data.label}/></span>;
    }
}

const data = {
    label: "Akash"
};

const items = [
    { label: "Acting" },
    { label: "Dancing" }
];

@Pack
export default class TooltipTest extends AtomControl {

    protected create(): void {
        this.data = data;
        this.render(<div style-width="100px" style-height="500px">
            <a tooltip={CustomTooltip}>Demo</a>
            <AtomRepeater
                items={items}
                itemRenderer={(item) => <div
                    tooltip={CustomTooltip}
                    text={item.label}/>}
                />
        </div>);
    }

}
