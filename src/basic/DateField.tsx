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
import InlinePopup, { InlinePopupButton } from "./InlinePopup";
import PopupButton from "./PopupButton";

CSS(StyleRule()
    .display("inline-block")
    .cursor("pointer")
    .hover(StyleRule()
    .textDecoration("underline")
    .color(Colors.blue)
    )
, "*[data-date-field=date-field]");

export default class DateField extends AtomControl {

    @BindableProperty
    public value: Date;

    @BindableProperty
    public enableFunc: (d: ICalendarDate) => boolean;

    @BindableProperty
    public format: (d: Date) => string;

    @BindableProperty
    public yearStart: any;

    @BindableProperty
    public yearEnd: any;

    @BindableProperty
    public year: number;

    @BindableProperty
    public prompt: string;

    protected preCreate(): void {
        this.prompt = "Select";
        this.value = null;
        this.format = (d) => d?.toLocaleDateString(
            navigator.language, {
                month: "short",
                year: "numeric",
                day: "numeric",
                weekday: "short"
            });

        const owner = this;
        class CalendarPopup extends InlinePopup {

            public owner: DateField;

            protected create(): void {
                this.owner = owner;
                super.create();
                const now = DateTime.utcNow;
                const yearStart = typeof this.owner.yearStart === "number" ? this.owner.yearStart : -10;
                const yearEnd = typeof this.owner.yearEnd === "number" ? this.owner.yearEnd : 10;
                const year = typeof this.owner.year === "number" ? this.owner.year : now.year;
                this.render(<div>
                    <Calendar
                        yearStart={yearStart}
                        yearEnd={yearEnd}
                        year={year}
                        event-item-select={Bind.event((s, e) => {
                            if (e.detail.disabled) {
                                return;
                            }
                            // this.selectedItem = e.detail;
                            this.owner.value = e.detail.value;
                            this.close(e.detail.value);
                            // setTimeout(() => this.owner.element.click() , 100);
                        })}
                        enableFunc={Bind.oneTime(() => this.owner.enableFunc)}
                        value={Bind.oneWay(() => this.owner.value)}
                /></div>);
            }
        }

        this.render(<InlinePopupButton
            data-date-field="date-field"
            text={Bind.oneWay(() => (this.format?.(this.value) ?? this.value?.toLocaleDateString()) || this.prompt )}>
            <CalendarPopup/>
        </InlinePopupButton>);
    }

}
