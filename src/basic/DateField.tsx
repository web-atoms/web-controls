import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import DateTime from "@web-atoms/date-time/dist/DateTime";
import Calendar, { ICalendarDate } from "./Calendar";
import InlinePopup, { InlinePopupButton } from "./InlinePopup";
import TimeEditor from "./TimeEditor";
import TimeSpan from "@web-atoms/date-time/dist/TimeSpan";

import "./styles/date-field-style";

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

export default class DateField extends AtomControl {

    public enableTime: boolean;

    @BindableProperty
    public value: Date;

    @BindableProperty
    public enableFunc: (d: ICalendarDate) => boolean;

    @BindableProperty
    public format: (d: Date, displayTime?: boolean) => string;

    @BindableProperty
    public yearStart: any;

    @BindableProperty
    public yearEnd: any;

    @BindableProperty
    public year: number;

    /**
     * Default hour in selecting time
     */
    @BindableProperty
    public hour: number;

    /**
     * Default minute in selecting time
     */
    @BindableProperty
    public minute: number;

    @BindableProperty
    public prompt: string;

    constructor(app, e = document.createElement("button")) {
        super(app, e);
    }

    protected preCreate(): void {
        this.prompt = "Select";
        this.enableTime = false;
        this.value = null;
        this.format = (d, showTime) => showTime
            ? d?.toLocaleString(
                navigator.language, {
                    month: "short",
                    year: "numeric",
                    day: "numeric",
                    weekday: "short",
                    hour12: true,
                    hour: "numeric",
                    minute: "2-digit"
                })
            : d?.toLocaleDateString(
                navigator.language, {
                    month: "short",
                    year: "numeric",
                    day: "numeric",
                    weekday: "short"
                });

        const owner = this;
        class CalendarPopup extends InlinePopup {

            public owner: DateField;

            public type;

            public time: TimeSpan;

            protected create(): void {
                this.owner = owner;
                this.type = "AM";
                const now = DateTime.from(owner.value ?? DateTime.today.addHours(owner.hour || 0).addMinutes(owner.minute || 0));
                this.time = new TimeSpan(0, now.hour, now.minute);
                super.create();
                const yearStart = typeof this.owner.yearStart === "number" ? this.owner.yearStart : -10;
                const yearEnd = typeof this.owner.yearEnd === "number" ? this.owner.yearEnd : 10;
                const year = typeof this.owner.year === "number" ? this.owner.year : now.year;
                this.render(<div class="calendar-popup">
                    <Calendar
                        yearStart={yearStart}
                        yearEnd={yearEnd}
                        year={year}
                        event-item-select={Bind.event((s, e) => {
                            if (e.detail.disabled) {
                                return;
                            }
                            this.save(e.detail.value);
                        })}
                        enableFunc={Bind.oneTime(() => this.owner.enableFunc)}
                        value={Bind.oneWay(() => this.owner.value)}
                    />
                    { this.owner.enableTime && <TimeEditor
                        time={Bind.twoWays(() => this.time)}
                    /> }
                    <button
                        class="clear"
                        text="Clear"
                        event-click={(e: Event) => {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            e.stopPropagation();
                            this.save();
                        }}/>
                    <button
                        class="today"
                        text="Today"
                        event-click={(e: Event) => {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            e.stopPropagation();
                            this.save(DateTime.today.asJSDate);
                        }}/>
                </div>);

                this.runAfterInit(() => {
                    if (this.element) {
                        (this.element as HTMLElement).scrollIntoView();
                    }
                });
            }

            private save(d?: Date) {
                if (!d) {
                    this.owner.value = d;
                    this.close(d);
                    return;
                }
                let date = DateTime.from((d));
                if (this.owner.enableTime) {
                    date = date.add(this.time);
                }
                this.owner.value = date.asJSDate;
                this.close(date);
            }
        }

        this.render(<InlinePopupButton
            data-layout="flex"
            data-date-field="date-field"
            text={Bind.oneWay(() => this.format?.(this.value, this.enableTime) || this.prompt)}>
            <CalendarPopup/>
        </InlinePopupButton>);
    }

}
