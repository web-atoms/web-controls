import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import WatchProperty from "@web-atoms/core/dist/core/WatchProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import DateTime from "@web-atoms/date-time/dist/DateTime";
import AtomRepeater from "./AtomRepeater";
import ComboBox from "./ComboBox";

const start = DateTime.now;

const getWeekDays = (locale, type: "short" | "long") => {
    const baseDate = new Date(Date.UTC(2017, 0, 2)); // just a Monday
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        weekDays.push(baseDate.toLocaleDateString(locale, { weekday: type }));
        baseDate.setDate(baseDate.getDate() + 1);
    }
    return weekDays;
};

const getMonths = (locale, type: "short" | "long") => {
    const baseDate = new Date(Date.UTC(2017, 0, 2)); // just a Monday
    const weekDays = [];
    for (let i = 0; i < 12; i++) {
        weekDays.push(baseDate.toLocaleDateString(locale, { month: type }));
        baseDate.setMonth(i + 1);
    }
    return weekDays;
};

export const weekdays = {

    short: getWeekDays(navigator.language, "short"),
    long: getWeekDays(navigator.language, "long"),
};

export const months = {
    short: getMonths(navigator.language, "short"),
    long: getMonths(navigator.language, "long")
};

const monthItems = months.long.map((x, i) => ({
    label: x,
    value: i
}));

const css = CSS(StyleRule()
    .display("inline-grid")
    .gridTemplateRows("auto auto auto")
    .gridTemplateColumns("auto auto auto auto")
    .child(StyleRule(".fa-solid")
        .padding(5)
        .paddingLeft(10)
        .paddingRight(10)
        .cursor("pointer")
        .hoverColor(Colors.blueViolet)
    )
    .child(StyleRule("select")
        .border("none")
    )
    .child(StyleRule(".week")
        .gridColumnStart("1")
        .gridColumnEnd("span 4")
        .gridRowStart("2")
        .display("inline-grid")
        .gridTemplateColumns("1fr 1fr 1fr 1fr 1fr 1fr 1fr")
        .gap(0)
        .child(StyleRule("*")
            .fontSize("smaller")
            .padding("5")
            .paddingLeft("10")
            .paddingRight("10")
            .cursor("default")
            .alignSelf("center")
            .justifySelf("center")
        )
    )
    .child(StyleRule(".dates")
        .gridColumnStart("1")
        .gridColumnEnd("span 4")
        .gridRowStart("3")
        .display("inline-grid")
        .gap(0)
        .child(StyleRule("[data-item-index]")
            .alignSelf("stretch")
            .justifySelf("stretch")
            .padding(7)
            .cursor("pointer")
            .textAlign("center")
            .hoverBackgroundColor(Colors.lightGray.withAlphaPercent(0.5))
            .and(StyleRule("[data-is-today=true]")
                .backgroundColor(Colors.lightGreen)
            )
            .and(StyleRule("[data-is-weekend=true]")
                .backgroundColor(Colors.lightGray.withAlphaPercent(0.3))
            )
            .and(StyleRule("[data-is-other-month=true]")
                .opacity("0.5")
            )
            .and(StyleRule("[data-disabled=true]")
                .textDecoration("line-through")
            )
            .and(StyleRule("[data-selected-item=true]")
                .backgroundColor(Colors.blueViolet)
                .color(Colors.white)
            )
        )
    )
);

export interface ICalendarDate {
    label: string;
    type: string;
    value: DateTime;
    isToday: boolean;
    isOtherMonth: boolean;
    isWeekend: boolean;
    row: number;
    column: number;
    disabled: boolean;
}

export default class Calendar extends AtomRepeater {

    @BindableProperty
    public year: number;

    @BindableProperty
    public month: number;

    @BindableProperty
    public yearStart: number;

    @BindableProperty
    public yearEnd: number;

    public enableFunc: (item: ICalendarDate) => boolean;

    public dateRenderer: (item: ICalendarDate) => XNode;

    @WatchProperty
    public get dates() {
        const year = this.year;
        const month = this.month;
        if (month === undefined || year === undefined) {
            return [];
        }
        const today = DateTime.today;
        let startDate = new DateTime(year, month, 1);
        while (startDate.dayOfWeek !== 1) {
            startDate = startDate.add(-1);
        }
        const a = [];
        const y = startDate.year;
        const m = startDate.month;
        const ef = this.enableFunc;
        for (let index = 0; index < 42; index++) {
            const cd = startDate.add(index);
            const item = {
                label: cd.day + "",
                row: Math.floor(index / 7),
                column: index % 7,
                type: null,
                value: cd,
                isToday: cd.equals(today),
                isOtherMonth: month !== cd.month,
                isWeekend: (cd.dayOfWeek === 0 || cd.dayOfWeek === 6),
                disabled: false
            };
            if (ef) {
                item.disabled = !(ef(item));
            }
            a.push(item);
        }
        return a;
    }

    @WatchProperty
    public get years() {
        const years = [];
        const s = start.year + this.yearStart;
        const e = start.year + this.yearEnd;
        for (let index = s; index < e; index++) {
            years.push({
                label: index.toString(),
                value: index
            });
        }
        return years;
    }

    public onPropertyChanged(name: keyof Calendar): void {
        super.onPropertyChanged(name);
        switch (name) {
            case "enableFunc":
            case "dateRenderer":
                this.updateItems();
                break;
        }
    }

    public next() {
        if (this.month === 11) {
            this.year++;
            this.month = 0;
            return;
        }
        this.month++;
    }

    public prev() {
        if (this.month === 0) {
            this.year--;
            this.month = 11;
            return;
        }
        this.month--;
    }

    protected preCreate(): void {
        const now = new Date();
        this.selectedItems = [];
        this.valuePath = (i) => i.value;
        this.yearStart = -10;
        this.yearEnd = 10;
        this.year = now.getFullYear();
        this.month = now.getMonth();
        this.render(<div
            class={css}
            items={Bind.oneWay(() => this.dates)}>
                <i
                    event-click={() => this.prev()}
                    class="fa-solid fa-angle-left"
                    title="Previous Month"/>
                <ComboBox
                    items={monthItems}
                    value={Bind.twoWays(() => this.month)} />
                <ComboBox
                    items={this.years}
                    value={Bind.twoWays(() => this.year)}/>
                <i
                    event-click={() => this.next()}
                    class="fa-solid fa-angle-right"
                    title="Next Month"/>
                <div class="week"/>
                <div class="dates"/>
            </div>);
        this.itemsPresenter = this.element.lastElementChild;
        const week = this.element.lastElementChild.previousElementSibling;
        let w = 1;
        for (const iterator of weekdays.short) {
            const text = document.createElement("span");
            text.textContent = iterator;
            week.appendChild(text);
            text.style.gridColumnStart = `${w++}`;
        }
        this.dateRenderer = (item) => <div text={item.label}/>;
        this.itemRenderer = (item: ICalendarDate) => {
            const d = this.dateRenderer(item);
            const a = d.attributes ??= {};
            if (!a["data-click-event"]) {
                a["data-click-event"] = "itemSelect";
            }
            a["data-is-today"] = item.isToday;
            a["data-is-other-month"] = item.isOtherMonth;
            a["data-is-weekend"] = item.isWeekend;
            a["data-disabled"] = item.disabled;
            a.styleGridColumnStart = (item.column + 1);
            a.styleGridRowStart = (item.row + 1);
            return d;
        };
    }

}
