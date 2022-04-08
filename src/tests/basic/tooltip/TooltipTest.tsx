import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomRepeater from "../../../basic/AtomRepeater";
import Tooltip from "../../../basic/Tooltip";

class CustomTooltip extends Tooltip {
    protected create(): void {
        this.render(<span>This is <i class="fa-solid fa-user"/>
            <b>HTML</b> tooltip by <span text={this.data.label}/></span>);
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
        this.render(<div style-width="500px" style-height="500px">
            <a tooltip={CustomTooltip}>Demo</a>
            <AtomRepeater
                items={items}
                itemRenderer={(item) => <div
                    tooltip={CustomTooltip}
                    data-tooltip-alignment="right"
                    text={item.label}/>}
                />
        </div>);
    }

}
