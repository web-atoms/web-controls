import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import PopupButton, { MenuItem } from "../../basic/PopupButton";
import type { HtmlEditorControl } from "../HtmlEditor";

export default function Align() {
    return <PopupButton
        class="command"
        icon="ri-align-left"
        title="Change Alignment">
        <MenuItem
            icon="ri-align-left"
            title="Align Left"
            eventClick={Bind.event((e: HtmlEditorControl) =>
                e.executeCommand("justifyLeft"))}/>
        <MenuItem
            icon="ri-align-center"
            title="Align Center"
            eventClick={Bind.event((e: HtmlEditorControl) =>
                e.executeCommand("justifyCenter"))}/>
        <MenuItem
            icon="ri-align-right"
            title="Align Right"
            eventClick={Bind.event((e: HtmlEditorControl) =>
                e.executeCommand("justifyRight"))}/>
        <MenuItem
            icon="ri-align-justify"
            title="Justify"
            eventClick={Bind.event((e: HtmlEditorControl) =>
                e.executeCommand("justifyFull"))}/>
    </PopupButton>;
}