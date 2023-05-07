import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import Form from "../../../basic/Form";
import FormField from "../../../basic/FormField";
import ToggleButtonBar from "../../../basic/ToggleButtonBar";

const groups = [ "Name", "Address", "All" ];
const css = CSS(StyleRule()
    .displayNone("> [data-form-group=name] > [data-wa-form-field]:not([data-group=name])")
    .displayNone("> [data-form-group=address] > [data-wa-form-field]:not([data-group=address])"));

@Pack
export default class GroupForm extends AtomControl {

    private group: string;

    protected create(): void {
        this.group = "Name";
        this.render(<div class={css}>
            <Form data-form-group={Bind.oneWay(() => this.group?.toLowerCase())}>
                <div>
                    <ToggleButtonBar
                        items={groups}
                        selectedItem={Bind.twoWays(() => this.group)}/>
                </div>
                <div style-display={Bind.oneWay(() => /name|all/i.test(this.group))}>
                    <FormField label="First">
                        <input/>
                    </FormField>
                    <FormField label="Last">
                        <input/>
                    </FormField>
                </div>
                <div style-display={Bind.oneWay(() => /address|all/i.test(this.group))}>
                    <FormField label="Line 1">
                        <input/>
                    </FormField>
                    <FormField label="Line 2">
                        <input/>
                    </FormField>
                </div>
                <div>
                    <button text="Save"/>
                </div>
            </Form>
        </div>);
    }

}
