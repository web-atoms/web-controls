import Bind, { IAtomComponent } from "@web-atoms/core/dist/core/Bind.js";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import AtomRepeater, { SelectAll, SelectorCheckBox } from "../../../basic/AtomRepeater.js";
import MergeNode from "../../../basic/MergeNode.js";
import ToggleButtonBar from "../../../basic/ToggleButtonBar.js";

const allOptions = [
    { label: "Audio", value: "audio"},
    { label: "Document", value: "document"},
    { label: "Photo", value: "photo"},
    { label: "Video", value: "video"},
];

@Pack
export default class RepeaterTest extends AtomControl {

    @BindableProperty
    public options: any[];

    protected create(): void {
        this.options = [];
        this.render(<div>
            <h5>Select</h5>
            <div>
                <SelectAll
                    items={allOptions}
                    selectedItems={this.options}
                    />
            </div>
            <AtomRepeater
                allowMultipleSelection={true}
                event-change-name={Bind.event<AtomRepeater>((s, e) => s.refreshItem(e.detail, this.changeName(e.detail)))}
                selectedItems={this.options}
                items={allOptions}
                itemRenderer={(item) => <div>
                    <SelectorCheckBox/>
                    <span style-font-weight={item.label.indexOf('*') !== -1 ? "bold" : ""} text={item.label}/>
                    <button data-click-event="change-name">Change</button>
                </div>}
                />
            <hr/>
            <h6>Selected</h6>
            <AtomRepeater
                items={Bind.oneWay(() => this.options)}
                itemRenderer={(item) => <div text={item.label}/>}
                />

            <h6>Toggle Sample</h6>
            <ToggleButtonBar
                items={allOptions}
                />
        </div>);
    }

    changeName(data) {
        data.label = data.label + "*";
        return MergeNode.childSelector("span");
    }

}
