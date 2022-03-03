import Bind, { IAtomComponent } from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomRepeater, { SelectAll, SelectorCheckBox } from "../../../basic/AtomRepeater";
import ToggleButtonBar from "../../../basic/ToggleButtonBar";

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
                event-change-name={Bind.event((s, e) => this.changeName(s, e))}
                selectedItems={this.options}
                items={allOptions}
                itemRenderer={(item) => <div>
                    <SelectorCheckBox/>
                    <span text={item.label}/>
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

    changeName(s: IAtomComponent, e: CustomEvent<any>): void {
        const data = e.detail;
        data.label = data.label + "*";
        const r = s as AtomRepeater;
        r.rebuildItem(data);
    }

}
