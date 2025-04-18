import XNode from "@web-atoms/core/dist/core/XNode";
import InlinePopupButton, { IPopupButton } from "./InlinePopupButton";

export default function PopupMenu(a: IPopupButton, ... nodes: XNode[]) {
    a.closeOnClick ??= true;
    return InlinePopupButton(a, ... nodes);
}