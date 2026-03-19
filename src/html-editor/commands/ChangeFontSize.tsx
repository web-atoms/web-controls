import Bind from "@web-atoms/core/dist/core/Bind.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import PopupButton, { MenuItem } from "../../basic/PopupButton.js";
import type AtomHtmlEditor from "../AtomHtmlEditor.js";
import Command, { ICommand } from "./Command.js";

export default function ChangeFontSize(cmd: ICommand) {
    return <PopupButton
        class="command"
        data-layout="toolbar-button"
        icon="ri-font-size-2"
        title="Change Font Size">
        <MenuItem icon="ri-add-line" label="Increase" eventClick={Bind.event((e: AtomHtmlEditor) =>
            e.executeCommand("increaseFontSize"))}/>
        <MenuItem icon="ri-subtract-line" label="Decrease" eventClick={Bind.event((e: AtomHtmlEditor) =>
            e.executeCommand("decreaseFontSize"))}/>
    </PopupButton>;

}
