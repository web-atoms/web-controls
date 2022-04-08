import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import Expander from "../../../basic/Expander";

@Pack
export default class ExpanderTest extends AtomControl {

    public isExpanded;

    protected create(): void {
        this.isExpanded = false;
        this.render(<div>
            <Expander
                icon={["fa-solid fa-cloud fa-xl", "fa-solid fa-dollar-sign fa-inverse"]}
                isExpanded={Bind.oneWay(() => this.isExpanded)}
                event-collapsed={() => this.isExpanded = false}
                event-expanded={() => this.isExpanded = true}>
                <h4>This is the header</h4>
                <div>This is the detail</div>
            </Expander>
        </div>);
    }

}
