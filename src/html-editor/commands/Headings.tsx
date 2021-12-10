import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import PopupButton, { MenuItem } from "../../basic/PopupButton";
import type { HtmlEditorControl } from "../HtmlEditor";

export default function Headings() {
    return <PopupButton
        class="command"
        icon="ri-heading"
        title="Apply Heading">
        <MenuItem icon="ri-h-1" eventClick={Bind.event((e: HtmlEditorControl) =>
            e.executeCommand("formatBlock", false, "H1"))}/>
        <MenuItem icon="ri-h-2" eventClick={Bind.event((e: any) =>
            e.executeCommand("formatBlock", false, "H2"))}/>
        <MenuItem icon="ri-h-3" eventClick={Bind.event((e: any) =>
            e.executeCommand("formatBlock", false, "H3"))}/>
        <MenuItem icon="ri-h-4" eventClick={Bind.event((e: any) =>
            e.executeCommand("formatBlock", false, "H4"))}/>
        <MenuItem icon="ri-h-5" eventClick={Bind.event((e: any) =>
            e.executeCommand("formatBlock", false, "H5"))}/>
        <MenuItem icon="ri-h-6" eventClick={Bind.event((e: any) =>
            e.executeCommand("formatBlock", false, "H6"))}/>
    </PopupButton>;
}
