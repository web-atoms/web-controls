import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import DateTime from "@web-atoms/date-time/dist/DateTime.js";
import { ICalendarDate } from "../../../basic/Calendar.js";
import DateField from "../../../basic/DateField.js";
import Form from "../../../basic/Form.js";
import FormField from "../../../basic/FormField.js";

const today = DateTime.today;

@Pack
export default class DateFieldTest extends AtomControl {

    protected create(): void {
        this.render(<div>
            <Form>
                <FormField label="Date">
                    <DateField
                        enableFunc={(item: ICalendarDate) => item.value >= today}
                        />
                </FormField>
                <FormField label="Date Time Morning">
                    <DateField
                        enableTime={true}
                        hour={9}
                        enableFunc={(item: ICalendarDate) => item.value >= today}
                        />
                </FormField>
                <FormField label="Date Time Evening">
                    <DateField
                        enableTime={true}
                        hour={18}
                        enableFunc={(item: ICalendarDate) => item.value >= today}
                        />
                </FormField>
            </Form>
            <br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        </div>);
    }

}
