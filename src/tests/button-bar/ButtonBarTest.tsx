import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import AtomButtonBar from "../../button-bar/AtomButtonBar.js";
import ButtonBar from "../../basic/ButtonBar.js";
import Form from "../../basic/Form.js";
import FormField from "../../basic/FormField.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";

const genders = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" }
];

@Pack
export default class ButtonBarTest extends AtomControl {

    gender = "Male";

    protected create(): void {
        this.render(<div>
            <Form data-padding="auto">
                <FormField label="Name">
                    <input placeholder="Name"/>
                </FormField>
                <FormField label="Gender">
                    <ButtonBar
                        items={genders}
                        value={Bind.twoWaysImmediate(() => this.gender)}
                        />
                </FormField>
                <FormField label="Selection">
                    <div text={Bind.oneWay(() => this.gender)}/>
                </FormField>
                <FormField label="">
                    <button>Save</button>
                </FormField>
            </Form>
        </div>);
    }

}
