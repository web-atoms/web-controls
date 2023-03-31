import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import DateTime from "@web-atoms/date-time/dist/DateTime";
import { ICalendarDate } from "../../../basic/Calendar";
import DateField from "../../../basic/DateField";
import Form from "../../../basic/Form";
import FormField from "../../../basic/FormField";

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
        </div>);
    }

}
