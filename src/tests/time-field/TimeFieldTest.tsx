import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomViewModel, Watch } from "@web-atoms/core/dist/view-model/AtomViewModel";
import Load from "@web-atoms/core/dist/view-model/Load";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import DateTime from "@web-atoms/date-time/dist/DateTime";
import TimeSpan from "@web-atoms/date-time/dist/TimeSpan";
import AtomDateField from "../../date-field/AtomDateField";
import AtomTimeField from "../../time-field/AtomTimeField";

export class TimeFieldTestViewModel extends AtomViewModel {

    public current: DateTime;

    public currentDate: DateTime;

    public currentTime: string;

    @Load({ init: true })
    public async loadDate() {
        this.current = DateTime.utcNow;
        this.currentDate = this.current.date;
        this.currentTime = this.current.time.toString(true);
    }

    @Watch
    public watchSetCurrent() {
        const ts = this.currentTime ? TimeSpan.parse(this.currentTime) : TimeSpan.fromSeconds(0);
        this.current = this.currentDate.add(ts);
    }
}

export default class TimeFieldTest extends AtomControl {

    public viewModel: TimeFieldTestViewModel;

    public create() {
        this.viewModel = this.resolve(TimeFieldTestViewModel);

        this.render(<div>
            <AtomDateField
                selectedDate={Bind.twoWays(() => this.viewModel.currentDate)}
                />
            <AtomTimeField
                time={Bind.twoWays(() => this.viewModel.currentTime)}
                />
            <div>
                <span text={Bind.oneWay(() => this.viewModel.current.toLocaleString())}></span>
            </div>
            <div>
                <span text={Bind.oneWay(() => this.viewModel.currentTime)}></span>
            </div>
        </div>);
    }

}
