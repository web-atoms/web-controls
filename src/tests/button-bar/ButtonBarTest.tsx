import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomButtonBar from "../../button-bar/AtomButtonBar";
import ButtonBar from "../../basic/ButtonBar";
import Form from "../../basic/Form";
import FormField from "../../basic/FormField";
import Bind from "@web-atoms/core/dist/core/Bind";

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
