import Bind from "@web-atoms/core/dist/core/Bind";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import PopupService, { IPopup, IPopupOptions } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

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

export interface IPopupButton {
    icon?: string;
    label?: string;
    showAsDialog?: boolean;
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
            <span>{label}</span>
        </div>;
    }
    return <div class="menu" eventClick={eventClick} { ... others }>
        <i class={icon}/>
    </div>;
}

const iconLabelCss = CSS(
    StyleRule(".label")
        .display("inline-flex")
        .child(StyleRule("span")
            .flexStretch()
        )
);

export default function PopupButton(
{
    icon,
    label,
    showAsDialog,
    ... others
}: IPopupButton,
... menus: Array<IMenuItem | XNode>) {

    let popup: IPopup = null;
    function openPopup(s: AtomControl, e: Event) {
        const button = e.currentTarget as HTMLElement;
        button.classList.add("pressed");
        if (popup) {
            popup.dispose();
            popup = null;
            return;
        }

        const menu = document.createElement("div");
        (s as any).render(<div class={menuCss}>
            { ... menus}
        </div>, menu);

        const ps = (s as any).resolve(PopupService) as PopupService;
        const options: IPopupOptions = showAsDialog
            ? {
                alignment: "centerOfScreen"
            }
            : null;
        popup = ps.show(button, menu, options);

        const dispose = () => {
            popup?.dispose();
            popup = null;
        };

        menu.addEventListener("click", dispose);

        popup.registerDisposable(() => {
            button.classList.remove("pressed");
            menu.removeEventListener("click", dispose);
            popup = null;
        });
    }

    if (label) {
        return <button
            { ... others }
            eventClick={Bind.event((s, e) => openPopup(s as AtomControl, e))}>
            <label class={iconLabelCss}>
                <i class={icon}/>
                <span>{label}</span>
            </label>
        </button>;
    }

    return <button
        { ... others }
        eventClick={Bind.event((s, e) => openPopup(s as AtomControl, e))}>
        <i class={icon}/>
    </button>;
}