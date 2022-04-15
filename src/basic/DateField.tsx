import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import Calendar, { ICalendarDate } from "./Calendar";
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

    protected preCreate(): void {
        this.value = null;
        this.format = (d) => d?.toLocaleDateString(
            navigator.language, {
                month: "short",
                year: "numeric",
                day: "numeric",
                weekday: "short"
            }) ?? "Select";

        const owner = this;
        class CalendarPopup extends Calendar {

            public owner: DateField;

            protected create(): void {
                this.owner = owner;
                super.create();
                if (owner.yearStart) {
                    this.yearStart = owner.yearStart;
                }
                if (owner.yearEnd) {
                    this.yearEnd = owner.yearEnd;
                }
                this.render(<Calendar
                    event-item-select={Bind.event((s, e) => {
                        if (e.detail.disabled) {
                            return;
                        }
                        this.selectedItem = e.detail;
                        this.owner.value = e.detail.value;
                        setTimeout(() => this.owner.element.click() , 100);
                    })}
                    enableFunc={Bind.oneTime(() => this.owner.enableFunc)}
                    value={Bind.oneWay(() => this.owner.value)}
                />);
            }
        }

        this.render(<PopupButton
            data-date-field="date-field"
            text={Bind.oneWay(() => this.format?.(this.value) ?? this.value?.toLocaleDateString() ?? "Select" )}>
            <CalendarPopup/>
        </PopupButton>);
    }

}
