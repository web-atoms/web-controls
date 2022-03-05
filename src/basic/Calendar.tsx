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
    .gridTemplateRows("auto auto 1fr")
    .gridTemplateColumns("auto 1fr 1fr auto")
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
            .and(StyleRule("[data-selected-item=true]")
                .backgroundColor(Colors.blueViolet)
                .color(Colors.white)
            )
            .and(StyleRule("[data-is-today=true]")
                .backgroundColor(Colors.lightGreen)
            )
            .and(StyleRule("[data-is-weekend=true]")
                .backgroundColor(Colors.lightGray.withAlphaPercent(0.3))
            )
            .and(StyleRule("[data-is-other-month=true]")
                .opacity("0.5")
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
}

export default class Calendar extends AtomRepeater {

    @BindableProperty
    public year: number;

    @BindableProperty
    public month: number;

    public dateRenderer: (item: ICalendarDate) => XNode;

    @WatchProperty
    public get dates() {
        const year = this.year;
        const month = this.month;
        if (month === undefined) {
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
        for (let index = 0; index < 42; index++) {
            const cd = startDate.add(index);
            a.push({
                label: cd.day + "",
                row: Math.floor(index / 7),
                column: index % 7,
                type: null,
                value: cd,
                isToday: cd.equals(today),
                isOtherMonth: month !== cd.month,
                isWeekend: (cd.dayOfWeek === 0 || cd.dayOfWeek === 6)
            });
        }
        return a;
    }

    protected preCreate(): void {
        const now = new Date();
        this.selectedItems = [];
        this.year = now.getFullYear();
        this.month = now.getMonth();
        this.render(<div
            class={css}
            items={Bind.oneWay(() => this.dates)}>
                <i class="fa-solid fa-angle-left"/>
                <ComboBox items={monthItems} value={Bind.twoWays(() => this.month)} />
                <ComboBox/>
                <i class="fa-solid fa-angle-right"/>
                <div class="dates"/>
            </div>);
        this.itemsPresenter = this.element.lastElementChild;
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
            a.styleGridColumnStart = (item.column + 1);
            a.styleGridRowStart = (item.row + 1);
            return d;
        };
    }

}
