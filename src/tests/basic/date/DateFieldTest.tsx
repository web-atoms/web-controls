import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import DateField from "../../../basic/DateField";
import Form from "../../../basic/Form";
import FormField from "../../../basic/FormField";

@Pack
export default class DateFieldTest extends AtomControl {

    protected create(): void {
        this.render(<div>
            <Form>
                <FormField label="Date">
                    <DateField/>
                </FormField>
            </Form>
        </div>);
    }

}
