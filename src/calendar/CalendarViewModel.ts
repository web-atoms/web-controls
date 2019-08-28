import { AtomViewModel, Watch } from "web-atoms-core/dist/view-model/AtomViewModel";

const now = new Date();

export interface ILabelValue {
    label?: string;
    value?: any;
}

export interface ICalendarItem {
    label: string;
    type?: string;
    isToday: boolean;
    isOtherMonth: boolean;
    isWeekend: boolean;
    value: Date;
}

function compareDate(d1: Date, d2: Date): boolean {
    if (!d1 || !d2) {
        return false;
    }
    if (d1.getFullYear() !== d2.getFullYear()) {
        return false;
    }
    if (d1.getMonth() !== d2.getMonth()) {
        return false;
    }
    return d1.getDate() === d2.getDate();
}

export default class CalendarViewModel extends AtomViewModel {

    public owner: any;

    public get year() {
        return this.start.getFullYear();
    }

    public set year(v: number) {
        if (this.start.getFullYear() === v) {
            return;
        }
        this.start.setFullYear(v);
        this.refresh("start");
    }

    public get month() {
        return this.start.getMonth();
    }

    public set month(v: number) {
        if (this.start.getMonth() === v) {
            return;
        }
        this.start.setMonth(v);
        this.refresh("start");
    }

    private mStart: Date = (new Date());
    public get start(): Date {
        return this.mStart;
    }
    public set start(value: Date) {
        this.mStart = value;
        this.refresh("year");
        this.refresh("month");
    }

    @Watch
    public get selectedDate(): any {
        return this.owner.selectedDate;
    }

    @Watch
    public get enableFunc(): any {
        return this.owner.enableFunc;
    }

    @Watch
    public get yearList(): ILabelValue[] {
        const start = this.year + this.owner.yearStart;
        const end = this.year + this.owner.yearEnd;

        const a = [];
        for (let index = start; index <= end; index++) {
            a.push({ label: index + "", value: index });
        }
        return a;
    }

    @Watch
    public get items(): ICalendarItem[] {
        const today = new Date();
        const start = this.start;
        const startDate = new Date(start.getFullYear(), start.getMonth(), 1);
        while (startDate.getDay() !== 1) {
            startDate.setDate(startDate.getDate() - 1);
        }
        const a = [];
        const y = startDate.getFullYear();
        const m = startDate.getMonth();
        for (let index = 0; index < 42; index++) {
            const d = index + startDate.getDate();
            const cd = new Date(y, m, d);
            a.push({
                label: cd.getDate().toString(),
                type: null,
                value: cd,
                isToday: compareDate(cd, today),
                isOtherMonth: start.getMonth() !== cd.getMonth(),
                isWeekend: (cd.getDay() === 0 || cd.getDay() === 6)
            });
        }
        const o = this.owner;
        o.element.dispatchEvent(new CustomEvent("refresh", {
            detail: {
                year: start.getFullYear(),
                month: start.getMonth()
            }
        }));
        o.currentDate = startDate;
        return a;
    }

    public changeMonth(step: number): void {
        const s = new Date(this.start.getFullYear(), this.start.getMonth(), 1);
        const start = this.year + this.owner.yearStart;
        const end = this.year + this.owner.yearEnd;
        s.setMonth(s.getMonth() + step);
        const sy = s.getFullYear();
        if (sy < start || sy > end) {
            return;
        }
        this.start = s;
        this.refresh("start");
    }

    public dateClicked(item: ICalendarItem): void {
        const e = this.owner.element as HTMLElement;
        this.owner.selectedDate = item.value;
        e.dispatchEvent(new CustomEvent("dateClicked", { detail: item } ));
    }

}
