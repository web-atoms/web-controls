import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import WatchProperty from "@web-atoms/core/dist/core/WatchProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import DateTime from "@web-atoms/date-time/dist/DateTime";
import AtomRepeater from "./AtomRepeater";
import Select from "./Select";

import "./styles/calendar-style";

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

function setValue(target, name, value) {
    Object.defineProperty(target, name, { value });
    return value;
}

export const weekdays = {

    get short() {
        return setValue(this, "short", getWeekDays(navigator.language, "short"));
    },
    get long() {
        return setValue(this, "long", getWeekDays(navigator.language, "long"));
    }
};

export const months = {
    get short() {
        return setValue(this, "short", getMonths(navigator.language, "short"));
    },
    get long() {
        return setValue(this, "long", getMonths(navigator.language, "long"));
    },

    get items() {
        return setValue(this, "items", this.long.map((x, i) => ({label: x, value: i})));
    }
};

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

    public set startDate(v) {
        if (this.dateModified) {
            return;
        }
        const year = v.getFullYear();
        const month = v.getMonth();
        if (this.year !== year) {
            this.year = year;
        }
        if (this.month !== month) {
            this.month = month;
        }
    }

    public enableFunc: (item: ICalendarDate) => boolean;

    public dateRenderer: (item: ICalendarDate) => XNode;

    @WatchProperty
    public get dates() {
        const year = this.year;
        const tm = this.month;
        if (tm === undefined || year === undefined) {
            return [];
        }
        const month = Number(tm);
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
        const e = start.year + this.yearEnd + 1;
        for (let index = s; index < e; index++) {
            years.push({
                label: index.toString(),
                value: index
            });
        }
        return years;
    }

    public set value(v) {
        // change the date....
        if (v instanceof Date) {
            this.startDate = v;
        }
        super.value = v;
    }

    /**
     * Date is modified by user, so do not auto select
     * start Date
     */
    private dateModified = false;

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
        super.preCreate();
        const now = new Date();
        this.selectedItems = [];
        this.valuePath = (i) => i?.value;
        this.yearStart = -10;
        this.yearEnd = 10;
        this.year = now.getFullYear();
        this.month = now.getMonth();
        this.comparer = (left: Date, right: Date) => left && right &&
            DateTime.from(left).date?.msSinceEpoch === DateTime.from(right).date?.msSinceEpoch;
        this.bindEvent(this.element, "change", () => this.dateModified = true, null, { capture: true });
        this.bindEvent(this.element, "itemSelect",
            (e: CustomEvent<ICalendarDate>) => e.detail.disabled ? e.preventDefault() : null);
        this.render(<div
            data-calendar="calendar"
            items={Bind.oneWay(() => this.dates)}>
                <i
                    event-click={() => this.prev()}
                    class="fa-solid fa-angle-left"
                    title="Previous Month"/>
                <Select
                    items={months.items}
                    value={Bind.twoWays(() => this.month)}
                    />
                <Select
                    items={Bind.oneWay(() => this.years)}
                    value={Bind.twoWays(() => this.year)}/>
                <i
                    event-click={() => this.next()}
                    class="fa-solid fa-angle-right"
                    title="Next Month"/>
                <div class="week"/>
                <div data-click-event="item-select" class="dates"/>
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
            if (item.isToday) {
                a["data-is-today"] = item.isToday;
            }
            if (item.isOtherMonth) {
                a["data-is-other-month"] = item.isOtherMonth;
            }
            if (item.isWeekend) {
                a["data-is-weekend"] = item.isWeekend;
            }
            if (item.disabled) {
                a["data-disabled"] = item.disabled;
            }
            return d;
        };
    }

    protected dispatchItemEvent(eventName: any, item: any, recreate: any, originalTarget: any, nestedItem?: any): void {
        this.dateModified = true;
        super.dispatchItemEvent(eventName, item, recreate, originalTarget, nestedItem);
    }

}
