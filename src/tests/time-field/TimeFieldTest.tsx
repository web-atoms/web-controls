import Bind from "@web-atoms/core/dist/core/Bind.js";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import { AtomViewModel, Watch } from "@web-atoms/core/dist/view-model/AtomViewModel.js";
import Load from "@web-atoms/core/dist/view-model/Load.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import DateTime from "@web-atoms/date-time/dist/DateTime.js";
import TimeSpan from "@web-atoms/date-time/dist/TimeSpan.js";
import AtomDateField from "../../date-field/AtomDateField.js";
import AtomTimeField from "../../time-field/AtomTimeField.js";

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

    declare public viewModel: TimeFieldTestViewModel;

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
