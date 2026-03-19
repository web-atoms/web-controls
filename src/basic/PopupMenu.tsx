import XNode from "@web-atoms/core/dist/core/XNode.js";
import InlinePopupButton, { IPopupButton } from "./InlinePopupButton.js";

export default function PopupMenu(a: IPopupButton, ... nodes: XNode[]) {
    a.closeOnClick ??= true;
    return InlinePopupButton(a, ... nodes);
}