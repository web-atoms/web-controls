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
        this.render(<PopupButton
            text={Bind.oneWay(() => this.format?.(this.value) ?? this.value?.toLocaleDateString() ?? "Select" )}>
            <Calendar
                event-item-select={Bind.event((s, e) => this.value = e.detail.value)}
                enableFunc={Bind.oneTime(() => this.enableFunc)}
                value={Bind.oneWay(() => this.value)}
                />
        </PopupButton>);
    }

}
