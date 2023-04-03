import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { descendentElementIterator } from "@web-atoms/core/dist/web/core/AtomUI";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import TimeSpan from "@web-atoms/date-time/dist/TimeSpan";
import Select from "./Select";
import Bind from "@web-atoms/core/dist/core/Bind";

function hours() {
    return [
        { label: "01", value: 1 },
        { label: "02", value: 2 },
        { label: "03", value: 3 },
        { label: "04", value: 4 },
        { label: "05", value: 5 },
        { label: "06", value: 6 },
        { label: "07", value: 7 },
        { label: "08", value: 8 },
        { label: "09", value: 9 },
        { label: "10", value: 10 },
        { label: "11", value: 11 },
        { label: "12", value: 12 },
    ];
}

function minutes() {
    const items = [];
    for (let index = 0; index < 10; index++) {
        items.push({ label: "0" + index, value: index });
    }
    for (let index = 10; index < 60; index++) {
        items.push({ label: index.toString(), value: index });
    }
    return items;
}

CSS(StyleRule()
    .paddingLeft(5)
    .gridRow("2")
    .flexLayout({ direction: "row", alignItems: "center", justifyContent: "start" as any, gap: 0})
    .child(StyleRule("[data-element=hour]")
        .marginLeft(5)
        .marginRight(5)
    )
    .child(StyleRule("[data-element=minute]")
        .marginRight(5)
    )
    .child(StyleRule("[data-element=pm]")
        .marginRight(5)
    )
    .child(StyleRule("button")
        .borderRadius(9999)
        .outline("none")
        .border("none")
        .backgroundColor("transparent")
        .and(StyleRule("[data-selected=true]")
            .backgroundColor("var(--accent-color, blue)")
            .color("var(--accent-text-color, white)")
        )
    )
    .child(StyleRule("button[data-element=am]")
        .borderTopRightRadius(0)
        .borderBottomRightRadius(0)
    )
    .child(StyleRule("button[data-element=pm]")
        .borderTopLeftRadius(0)
        .borderBottomLeftRadius(0)
    )
    .child(StyleRule("select")
        .border("none")
        .outline("none")
    ),"[data-time-editor]");

export default class TimeEditor extends AtomControl {

    // private time: TimeSpan;

    public get time(): TimeSpan {
        let t = new TimeSpan(0, this.hour, this.minute);
        if (this.isPM) {
            t = t.add(TimeSpan.fromHours(12));
        }
        return t;
    }

    public set time(v: TimeSpan) {
        if(!v) {
            v = TimeSpan.fromSeconds(0);
        }
        let h = v.hours;
        if (h > 12) {
            h -= 12;
            this.isPM = true;
        }
        this.hour = h;
        this.minute = v.minutes;
        AtomBinder.refreshValue(this, "time");
    }

    public hour: number;

    public minute: number;

    public isPM: boolean;
    
    protected create(): void {
        this.isPM = false;
        this.hour = 12;
        this.minute = 0;
        this.render(<div
            data-time-editor="time-editor"
            event-change={() => setTimeout(() => AtomBinder.refreshValue(this, "time"), 1)}>
            <Select
                data-element="hour"
                items={hours()}
                value={Bind.twoWays(() => this.hour)}/>
            <Select
                data-element="minute" items={minutes()}
                value={Bind.twoWays(() => this.minute)}/>
            <button
                event-click={() => (this.isPM = false, AtomBinder.refreshValue(this, "time"))}
                data-selected={Bind.oneWay(() => !this.isPM)}
                data-element="am"
                text="AM"/>
            <button
                event-click={() => (this.isPM = true, AtomBinder.refreshValue(this, "time"))}
                data-selected={Bind.oneWay(() => this.isPM)}
                data-element="pm"
                text="PM"/>
        </div>);
    }

}
