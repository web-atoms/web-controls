import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import Form, { SubmitButton } from "../../../basic/Form";
import FormField from "../../../basic/FormField";

@Pack
export default class BasicForm extends AtomControl {

    protected create(): void {
        this.data = {
            firstName: "",
            lastName: "",
            emailAddress: ""
        };
        this.render(<div>
            <Form>
                <FormField
                    label="First name:"
                    required={true}
                    error={Bind.oneWay(() => this.data.firstName ? "" : "First name is required")}>
                    <input value={Bind.twoWaysImmediate(() => this.data.firstName)}/>
                </FormField>
                <FormField
                    label="Last name:"
                    required={true}
                    error={Bind.oneWay(() => this.data.lastName ? "" : "Last name is required")}>
                    <input value={Bind.twoWaysImmediate(() => this.data.lastName)}/>
                </FormField>
                <FormField
                    label="Email:"
                    error={Bind.oneWay(() => this.data.emailAddress ? "" : "Email address is required")}>
                    <input value={Bind.twoWaysImmediate(() => this.data.emailAddress)}/>
                </FormField>
                <SubmitButton
                    text="Submit"
                    eventClick={() => alert("Success")}/>
            </Form>
        </div>);
    }

}
