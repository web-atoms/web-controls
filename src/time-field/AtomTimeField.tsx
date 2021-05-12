import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import { PropertyBinding } from "@web-atoms/core/dist/core/PropertyBinding";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomViewModel } from "@web-atoms/core/dist/view-model/AtomViewModel";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { AtomToggleButtonBar } from "@web-atoms/core/dist/web/controls/AtomToggleButtonBar";
import DateTime from "@web-atoms/date-time/dist/DateTime";
import TimeSpan from "@web-atoms/date-time/dist/TimeSpan";
import AtomTimeFieldStyle from "./AtomTimeFieldStyle";

const zones = [
    { label: "AM", value: "AM" },
    { label: "PM", value: "PM" }
];

function toTimeString(ts: ITimeInfo) {
    const h = ts.zone === "AM" ? ts.hour : ts.hour + 12;
    const t = new TimeSpan(0, h , ts.minutes);
    return t.toString(true);
}

function fromTimeString(t: string, ti: ITimeInfo): ITimeInfo {
    if (!t) {
        return ti;
    }
    const ts = TimeSpan.parse(t);
    const isMorning = ts.totalMinutes < 12 * 60;
    ti = ti || {} as any;
    ti.hour = isMorning ? ts.hours : ts.hours - 12;
    ti.minutes = ts.minutes;
    ti.zone = isMorning ? "AM" : "PM";
    return ti;
}

export interface ITimeInfo {
    hour: number;
    minutes: number;
    zone: string;
}

export default class AtomTimeField extends AtomControl {

    @BindableProperty
    public time: string;

    @BindableProperty
    public hour: number;

    @BindableProperty
    public minutes: number;

    @BindableProperty
    public zone: string;

    @BindableProperty
    public ts: ITimeInfo;

    public preCreate() {
        super.preCreate();

        this.defaultControlStyle = AtomTimeFieldStyle;

        this.registerDisposable(
            new PropertyBinding(
                this,
                this.element,
                "time",
            [["this", "ts"]],
            true, {
                fromSource: (v) => toTimeString(v),
                fromTarget: (v) => fromTimeString(v, this.ts)
            }, this
            )
        );
    }

    public create() {
        this.render(<div
            class={this.controlStyle.name}
            time={Bind.oneWay(() => this.changed(this.ts.hour, this.ts.minutes, this.ts.zone))}
            >
            <input
                class="hour"
                type="number"
                max="12"
                min="0"
                value={Bind.twoWaysImmediate(() => this.ts.hour)}
                />
            <input
                class="minutes"
                type="number"
                min="0"
                max="59"
                value={Bind.twoWaysImmediate(() => this.ts.minutes)} />
            <AtomToggleButtonBar
                items={zones}
                value={Bind.twoWays(() => this.ts.zone)}
                />
        </div>);
    }

    private changed(hour: number, minutes: number, zone: string): string {
        const n = { hour, minutes, zone};
        return toTimeString(n);
    }
}
