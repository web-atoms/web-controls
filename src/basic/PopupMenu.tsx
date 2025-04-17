import XNode from "@web-atoms/core/dist/core/XNode";
import InlinePopupButton, { IPopupButton } from "./InlinePopupButton";

export default function PopupMenu(a: IPopupButton, ... nodes: XNode[]) {
    return InlinePopupButton(a, ... nodes);
}