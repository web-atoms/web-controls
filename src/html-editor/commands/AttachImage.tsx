import XNode from "@web-atoms/core/dist/core/XNode";
import UploadEvent, { FilesAvailableEventArgs } from "../../basic/UploadEvent";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";

const onAttachImage = async (ce: FilesAvailableEventArgs) => {
    const c = AtomControl.from(ce.target) as any;
    // create data url...
    if(!ce.detail?.files?.length) {
        return;
    } 
    const file = ce.detail.files[0];

    const fr = new FileReader();
    fr.onload = () => {
        c.executeCommand("insertHTML", void 0, `<div><img data-content="data-url" src="${fr.result}" style='max-height: 700px;'/></div>`);
    }
    fr.readAsDataURL(file);
}

export default function AttachImage({
    accept = "image/*",
    maxSize = 1024*1024*5,
    authorize = true,
    capture = null as string,
    ariaLabel = "upload"
}) {
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
            ariaLabel,
            "event-files-available": onAttachImage
        })}
        >
        <i class="ri-image-add-fill" />
    </button>;
}
