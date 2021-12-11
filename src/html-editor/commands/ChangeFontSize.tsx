import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import PopupButton, { MenuItem } from "../../basic/PopupButton";
import type HtmlEditor from "../HtmlEditor";
import Command, { ICommand } from "./Command";

export default function ChangeFontSize(cmd: ICommand) {
    return <PopupButton
        class="command"
        icon="ri-font-size-2"
        title="Change Font Size">
        <MenuItem icon="ri-add-line" label="Increase" eventClick={Bind.event((e: HtmlEditor) =>
            e.executeCommand("increaseFontSize"))}/>
        <MenuItem icon="ri-subtract-line" label="Decrease" eventClick={Bind.event((e: HtmlEditor) =>
            e.executeCommand("decreaseFontSize"))}/>
    </PopupButton>;

}
