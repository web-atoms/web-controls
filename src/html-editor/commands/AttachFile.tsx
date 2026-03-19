import XNode from "@web-atoms/core/dist/core/XNode.js";
import AtomHtmlEditor from "../AtomHtmlEditor.js";
import CommandButton from "./CommandButton.js";
import HtmlCommands from "./HtmlCommands.js";
import UploadEvent from "../../basic/UploadEvent.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";

export default function AttachFile({
    accept = "image/*",
    maxSize = 1024*1024*5,
    authorize = true,
    capture = null as string,
    ariaLabel = "upload"
}) {
    // return CommandButton({
    //     icon: "ri-attachment-2",
    //     insertCommand,
    //     disabled: false,
    //     title: "Insert Image",
    //     eventInsertHtml
    // });
    return <button
        title="Insert Image"
        class="command"
        { ... UploadEvent.AttachUploadAction({
            accept,
            forceType: true,
            maxSize,
            authorize,
            capture,
            multiple: false,
            ariaLabel
        })}
        >
        <i class="ri-attachment-2" />
    </button>;
}
