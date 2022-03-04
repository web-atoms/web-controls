import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import WatchProperty from "@web-atoms/core/dist/core/WatchProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import DateTime from "@web-atoms/date-time/dist/DateTime";
import AtomRepeater from "./AtomRepeater";
import ComboBox from "./ComboBox";

const css = CSS(StyleRule()
    .display("inline-grid")
    .gridTemplateRows("auto auto 1fr")
    .gridTemplateColumns("auto 1fr 1fr auto")
);

export interface ICalendarDate {
    label: string;
    type: string;
    value: DateTime;
    isToday: boolean;
    isOtherMonth: boolean;
    isWeekend: boolean;
}

export default class Calendar extends AtomRepeater {

    @BindableProperty
    public year: number;

    @BindableProperty
    public month: number;

    @WatchProperty
    public get dates() {
        const year = this.year;
        const month = this.month;
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
        this.year = now.getFullYear();
        this.month = now.getMonth();
        this.render(<div
            class={css}
            items={Bind.oneWay(() => this.dates)}>
                <i class="fa-solid fa-angle-left"/>
                <ComboBox/>
                <ComboBox/>
                <i class="fa-solid fa-angle-right"/>
                <div class="dates"/>
            </div>)
        this.itemsPresenter = this.element.lastElementChild;
    }

} 