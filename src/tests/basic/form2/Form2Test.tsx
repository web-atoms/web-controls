import Pack from "@web-atoms/core/dist/Pack.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import Form, { BindError } from "../../../basic/Form.js";
import FormField from "../../../basic/FormField.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import Action from "@web-atoms/core/dist/view-model/Action.js";

@Pack
export default class Form2Test extends AtomControl {

    username: string;
    password: string;

    protected create(): void {

        this.username = "";
        this.password = "";

        this.render(<div>

            <Form>
                <FormField
                    label="Username"
                    required={true}
                    error={BindError({ value: () => this.username })}
                    >
                    <input value={Bind.twoWaysImmediate(() => this.username)}/>
                </FormField>
                <div data-layout="command-row">
                    <button type="submit" text="Send"/>
                </div>
            </Form>

        </div>);
    }

    @Action({ onEvent: "submit-form"})
    submitForm() {
        alert("Submitted");
    }

}