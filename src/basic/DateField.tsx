import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import Calendar, { ICalendarDate } from "./Calendar";
import PopupButton from "./PopupButton";


CSS(StyleRule()
    .flexLayout({
        
    })
    .child(StyleRule(".date")
        .flexStretch()
    )
, "*[data-date-field=date-field]")

export default class DateField extends AtomControl {

    @BindableProperty
    public value: Date;

    @BindableProperty
    public enableFunc: (d: ICalendarDate) => boolean;

    @BindableProperty
    public format: (d: Date) => string;

    protected preCreate(): void {
        this.value = null;
        this.format = null;

        const owner = this;
        class CalendarPopup extends Calendar {

            public owner: DateField;

            protected create(): void {
                this.owner = owner;
                super.create();
                this.render(<Calendar
                    event-item-select={Bind.event((s, e) => {
                        this.owner.value = e.detail.value;
                        setTimeout(() => this.owner.element.click() , 100);
                    })}
                    enableFunc={Bind.oneTime(() => this.owner.enableFunc)}
                    value={Bind.oneWay(() => this.owner.value)}
                />);
            }
        }

        this.render(<PopupButton
            text={Bind.oneWay(() => this.format?.(this.value) ?? this.value?.toLocaleDateString() ?? "Select" )}>
            <CalendarPopup/>
        </PopupButton>);
    }

}