import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomRepeater, { SelectAll, SelectorCheckBox } from "../../../basic/AtomRepeater";

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
                selectedItems={this.options}
                items={allOptions}
                itemRenderer={(item) => <div>
                    <SelectorCheckBox/>
                    <span text={item.label}/>
                </div>}
                />
            <hr/>
            <h6>Selected</h6>
            <AtomRepeater
                items={Bind.oneWay(() => this.options)}
                itemRenderer={(item) => <div text={item.label}/>}
                />
        </div>);
    }

}
