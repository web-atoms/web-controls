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

    public year: number = now.getFullYear();

    public month: number = now.getMonth();

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
        const startDate = new Date(this.year, this.month, 1);
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
                isOtherMonth: this.month !== cd.getMonth(),
                isWeekend: (cd.getDay() === 0 || cd.getDay() === 6)
            });
        }
        return a;
    }

    public changeMonth(step: number): void {
        const d = new Date(this.year, this.month);
        d.setMonth(d.getMonth() + step);
        this.year = d.getFullYear();
        this.month = d.getMonth();
    }

    public dateClicked(item: ICalendarItem): void {
        const e = this.owner.element as HTMLElement;
        this.owner.selectedDate = item.value;
        e.dispatchEvent(new CustomEvent("dateClicked", { detail: item } ));
    }

}
