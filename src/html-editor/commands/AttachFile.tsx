import XNode from "@web-atoms/core/dist/core/XNode";
import AtomHtmlEditor from "../AtomHtmlEditor";
import CommandButton from "./CommandButton";
import HtmlCommands from "./HtmlCommands";
import UploadEvent from "../../basic/UploadEvent";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";

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
