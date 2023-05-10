import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import InlinePopup, { IInlinePopupButtonOptions, InlinePopupButton } from "./InlinePopup";

import "./styles/popup-button-style";

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

    if (href) {
        return <a data-menu-item="menu-item" href={href} target={target} { ... others }>
            { icon && <i class={icon}/>}
            { label && <span text={label}/>}
        </a>;
    }

    return <div data-menu-item="menu-item" eventClick={eventClick} { ... others }>
        { icon && <i class={icon}/>}
        { label && <span text={label}/>}
    </div>;
}

export default InlinePopupButton;

export function PopupActionButton(a: IInlinePopupButtonOptions, ... nodes: XNode[]) {
    a.anchorRight = true;
    a["data-alignment"] = "bottom-right";
    return InlinePopupButton(a, ... nodes);
}

// export default function PopupButton(
// {
//     icon,
//     label,
//     showAsDialog,
//     ... others
// }: IPopupButton,
// ... menus: Array<IMenuItem | XNode>) {

//     let popup: IPopup = null;
//     function openPopup(s: AtomControl, e: Event) {
//         const button = e.currentTarget as HTMLElement;
//         button.classList.add("pressed");
//         if (popup) {
//             popup.dispose();
//             popup = null;
//             return;
//         }

//         const menu = document.createElement("div");
//         (s as any).render(<div data-menu-items="menu-items">
//             { ... menus}
//         </div>, menu);

//         const options: IPopupOptions = showAsDialog
//             ? {
//                 alignment: "centerOfScreen",
//                 popupStyle: ".none"
//             }
//             : {
//                 alignment: "bottomLeft",
//                 popupStyle: ".none"
//             };
//         popup = PopupService.show(button, menu, options);

//         const clickHandler = (e) => {
//             let start = e.target as HTMLElement;
//             const body = document.body;
//             while (start) {
//                 if (start === body) {
//                     return;
//                 }
//                 if (start.dataset.menuItem === "menu-item") {
//                     break;
//                 }
//                 start = start.parentElement;
//             }
//             popup?.dispose();
//             popup = null;
//         };

//         menu.addEventListener("click", clickHandler);

//         popup.registerDisposable(() => {
//             button.classList.remove("pressed");
//             menu.removeEventListener("click", clickHandler);
//             popup = null;
//         });
//     }

//     if (label) {
//         return <button
//             { ... others }
//             eventClick={Bind.event((s, e) => openPopup(s as AtomControl, e))}>
//             <label class={iconLabelCss}>
//                 <i class={icon}/>
//                 <span>{label}</span>
//             </label>
//         </button>;
//     }

//     return <button
//         { ... others }
//         eventClick={Bind.event((s, e) => openPopup(s as AtomControl, e))}>
//         <i class={icon}/>
//     </button>;
// }
