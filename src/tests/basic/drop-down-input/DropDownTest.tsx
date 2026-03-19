import Bind from "@web-atoms/core/dist/core/Bind.js";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import DropDownInput from "../../../basic/DropDownInput.js";
import Form from "../../../basic/Form.js";
import FormField from "../../../basic/FormField.js";

const genders = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" }
];

@Pack
export default class DropDownInputTest extends AtomControl {

    @BindableProperty
    public gender: string;

    @BindableProperty
    public gender2: string;

    protected create(): void {
        this.gender = "female";
        this.render(<div>
            <Form>
                <FormField label="">
                    <DropDownInput
                        autofocus={true}
                        items={genders}
                        value={Bind.twoWays(() => this.gender)}
                        />
                </FormField>
                <div>
                    <span text={Bind.oneWay(() => `Selected: ${this.gender}`)}/>
                </div>
                <FormField label="">
                    <DropDownInput
                        items={genders}
                        value={Bind.twoWays(() => this.gender2)}
                        />
                </FormField>
                <div>
                    <span text={Bind.oneWay(() => `Selected: ${this.gender2}`)}/>
                </div>
                <FormField label="">
                    <button>Save</button>
                </FormField>
            </Form>
        </div>);
    }

}
