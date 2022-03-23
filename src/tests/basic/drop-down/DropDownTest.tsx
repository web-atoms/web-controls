import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import DropDown from "../../../basic/DropDown";

const genders = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" }
];

@Pack
export default class DropDownTest extends AtomControl {

    @BindableProperty
    public gender: string;

    protected create(): void {
        this.gender = "female";
        this.render(<div>
            <DropDown
                items={genders}
                value={Bind.twoWays(() => this.gender)}
                itemRenderer={(item) => <div text={item.label}/>}
                suggestionRenderer={(item) => <div text={`${item.label} (${item.value})`}/>}
                />
            <span text={Bind.oneWay(() => `Selected: ${this.gender}`)}/>
        </div>);
    }

}
