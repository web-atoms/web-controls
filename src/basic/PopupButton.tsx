import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import { IDisposable } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { AtomItemsControl } from "@web-atoms/core/dist/web/controls/AtomItemsControl";
import PopupService from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import combineClasses from "./combineClasses";
import Button from "./Button";
import IElement from "./IElement";

const menuCss = CSS(StyleRule()
    .child(StyleRule(".menu")
        .padding(5)
        .margin(3)
        .borderRadius(5)
        .cursor("pointer")
        .hoverBackgroundColor(Colors.lightGreen)
    )
);

export interface IMenuItem {
    label?: string;
    icon?: string;
    eventClick?: any;
    href?: string;
    target?: string;
    [key: string]: any;
}

export function MenuItem({
    label,
    icon,
    eventClick,
    href,
    target,
    ... others
}: IMenuItem) {

    if (label) {
        return <div class="menu" eventClick={eventClick} { ... others }>
            <i class={icon}/>
        </div>;
    }
    return <div class="menu" eventClick={eventClick} { ... others }>
        <i class={icon}/>
    </div>;
}

export class MenuItemTemplate extends AtomControl {

    public data: IMenuItem;

    public create() {
        this.render(<div
            class="menu"
            eventClick={Bind.event(() => this.app.runAsync(() => this.data.eventClick()))}
            >
            <i
                styleDisplay={Bind.oneWay(() => this.data.icon ? "" : "none")}
                class={Bind.oneWay(() => this.data.icon)}/>
            <span
                styleDisplay={Bind.oneWay(() => this.data.label ? "" : "none")}
                text={Bind.oneWay(() => this.data.label)}></span>
        </div>);
    }
}

class PopupMenuButton extends AtomControl {

    @BindableProperty
    public subClass: string;

    @BindableProperty
    public icon: string;

    @BindableProperty
    public text: string;

    @BindableProperty
    public menus: IMenuItem[];

    private popup: IDisposable;

    constructor(app, e) {
        super(app, e ?? document.createElement("button"));
    }

    public preCreate() {
        super.preCreate();
        this.popup = null;
        this.text = null;
        this.icon = null;
        this.subClass = null;
        this.render(<button
            class={Bind.oneWay(() => combineClasses(Button.className, this.popup ? "pressed" : null, this.subClass))}
            eventClick={Bind.event(() => this.openPopup())}>
            <label class="label">
                <i class={Bind.oneWay(() => this.icon)}/>
                <span
                    styleDisplay={Bind.oneWay(() => this.text ? "" : "none")}
                    text={Bind.oneWay(() => this.text)}/>
            </label>
        </button>);
    }

    private openPopup() {
        if (this.popup) {
            this.popup.dispose();
            return;
        }

        const menus = this.menus;

        class Popup extends AtomControl {
            protected create(): void {
                this.render(<div class={menuCss}>
                    { ... menus}
                </div>);
            }
        }
        const items = new Popup(this.app, document.createElement("div"));
        items.registerDisposable({
            dispose: () => {
                this.popup = null;
            }
        });
        items.bindEvent(items.element, "click", () => {
            setTimeout(() => {
            this.openPopup();
            }, 100);
        });
        const popupService = this.app.resolve(PopupService);
        this.popup = popupService.show(this.element, items);
    }
}

export default function PopupButton( props: IElement,  ... menus: IMenuItem[]) {
    return <PopupMenuButton
        { ... props }
        menus={menus}
        />;
}
