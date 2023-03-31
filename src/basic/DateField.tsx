import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import DateTime from "@web-atoms/date-time/dist/DateTime";
import Calendar, { ICalendarDate } from "./Calendar";
import ComboBox from "./ComboBox";
import InlinePopup, { InlinePopupButton } from "./InlinePopup";
import PopupButton from "./PopupButton";
import ToggleButtonBar from "./ToggleButtonBar";

CSS(StyleRule()
    .display("inline-block")
    .cursor("pointer")
    .textAlign("left")
    .hover(StyleRule()
        .textDecoration("underline")
        .color(Colors.blue)
    )
    .nested(StyleRule(".calendar-popup")
        .display("grid")
        .gridTemplateColumns("1fr auto")
        .gridTemplateRows("1fr auto auto")
        .child(StyleRule("[data-calendar]")
            .gridRow("1")
            .gridColumn("1")
        )
        .child(StyleRule(".time-editor")
            .gridRow("2")
            .flexLayout({ direction: "row", alignItems: "center", justifyContent: "start" as any})
            .nested(StyleRule("[data-item-index]")
                .paddingTop(0)
                .paddingBottom(0)
            )
            .nested(StyleRule("select")
                .border("none")
                .outline("none")
            )
        )
        .child(StyleRule(".clear")
            .gridColumn("1")
            .gridRow("3")
            .justifySelf("start")
            .border("none")
            .outline("none")
            .backgroundColor(Colors.transparent)
            .color("var(--accent-color, blue)")
        )
        .child(StyleRule(".now")
            .gridRow("3")
            .gridColumn("2")
        )
    )
, "*[data-date-field=date-field]");

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

            public hour: any;

            public minute: any;

            public type;

            protected create(): void {
                this.owner = owner;
                this.type = "AM";
                this.hour = 9;
                this.minute = 0;
                super.create();
                const now = DateTime.utcNow;
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
                            // this.selectedItem = e.detail;
                            let date = DateTime.from((e.detail.value as Date));
                            if (this.owner.enableTime) {
                                date = date.addHours(this.hour)
                                    .addMinutes(this.minute);
                                if (this.type === "PM") {
                                    date = date.addHours(12);
                                }
                            }
                            this.owner.value = date.asJSDate;
                            this.close(date);
                            // setTimeout(() => this.owner.element.click() , 100);
                        })}
                        enableFunc={Bind.oneTime(() => this.owner.enableFunc)}
                        value={Bind.oneWay(() => this.owner.value)}
                    />
                    { this.owner.enableTime && <div class="time-editor">
                        <span text="Time"/>
                        <ComboBox
                            prompt="-"
                            items={hours()}
                            value={Bind.twoWays(() => this.hour)}
                            />
                        <ComboBox
                            prompt="-"
                            items={minutes()}
                            value={Bind.twoWays(() => this.minute)}
                            />
                        <ToggleButtonBar
                            value={Bind.twoWays(() => this.type)}
                            items={[{ label: "AM", value: "AM"}, { label: "PM", value: "PM"}]}/>
                    </div> }
                    <button
                        class="clear"
                        text="Clear"
                        event-click={(e: Event) => {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            e.stopPropagation();
                            this.owner.value = null; this.close(null);
                        }}/>
                </div>);
            }
        }

        this.render(<InlinePopupButton
            data-date-field="date-field"
            text={Bind.oneWay(() => this.format?.(this.value, this.enableTime) || this.prompt)}>
            <CalendarPopup/>
        </InlinePopupButton>);
    }

}
