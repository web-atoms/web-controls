import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import PopupButton, { MenuItem } from "../../basic/PopupButton";
import type AtomHtmlEditor from "../AtomHtmlEditor";
import { IPopupOptions } from "@web-atoms/core/dist/web/services/PopupService";

export default function Align({ alignment = "bottomRight" as IPopupOptions["alignment"]}) {
    return <PopupButton
        class="command"
        data-layout="toolbar-button"
        icon="ri-align-left"
        title="Change Alignment"
        alignment={alignment}>
        <MenuItem
            icon="ri-align-left"
            title="Align Left"
            eventClick={Bind.event((e: AtomHtmlEditor) =>
                e.executeCommand("justifyLeft"))}/>
        <MenuItem
            icon="ri-align-center"
            title="Align Center"
            eventClick={Bind.event((e: AtomHtmlEditor) =>
                e.executeCommand("justifyCenter"))}/>
        <MenuItem
            icon="ri-align-right"
            title="Align Right"
            eventClick={Bind.event((e: AtomHtmlEditor) =>
                e.executeCommand("justifyRight"))}/>
        <MenuItem
            icon="ri-align-justify"
            title="Justify"
            eventClick={Bind.event((e: AtomHtmlEditor) =>
                e.executeCommand("justifyFull"))}/>
    </PopupButton>;
}
