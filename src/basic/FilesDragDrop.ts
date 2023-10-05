const supportsFileSystemAccessAPI =
  "getAsFileSystemHandle" in DataTransferItem.prototype;
const supportsWebkitGetAsEntry =
  "webkitGetAsEntry" in DataTransferItem.prototype;

import styled from "@web-atoms/core/dist/style/styled";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";

    styled.css `

        &[data-drop-enabled] {
            outline: solid 5px green;
        }

    `.installGlobal("[data-drag-drop=\"1\"]");

const dragEnter = (e: DragEvent) => {
    if (!e.dataTransfer) {
        return;
    }
    (e.currentTarget as HTMLElement).setAttribute("data-drop-enabled", "1");
};

const dragOver = (e: DragEvent) => {
    if (!e.dataTransfer) {
        return;
    }
    e.preventDefault();
};

const dragLeave = (e: DragEvent) => {
    if (!e.dataTransfer) {
        return;
    }
    (e.currentTarget as HTMLElement).removeAttribute("data-drop-enabled");
};

const eventDrop = (e: DragEvent) => {
    if (!e.dataTransfer) {
        return;
    }
    e.preventDefault();
    const currentTarget = e.currentTarget as HTMLElement;
    currentTarget.removeAttribute("data-drop-enabled");

    const uploadEvent = currentTarget.getAttribute("data-upload-event");
    const extra = currentTarget.getAttribute("data-extra");

    const fileHandlesPromises = [...e.dataTransfer.items as any]
        .filter((item) => item.kind === "file")
        .map((item) =>
            supportsFileSystemAccessAPI
            ? item.getAsFileSystemHandle()
            : supportsWebkitGetAsEntry
            ? item.webkitGetAsEntry()
            : item.getAsFile()
        );

    const files = [] as File[];

    const getFiles = async (dir: any, parent: string = dir.name) => {
        const all = [];
        for await(const [name,handle] of dir.entries()) {
            const path = `${parent}/${handle.name}`;
            if (handle.kind === "directory" || handle.isDirectory) {
                all.push(... (await getFiles(handle, path)));
                continue;
            }
            const file = await handle.getFile();
            Object.defineProperty(file, "webkitRelativePath", { value: path });
            all.push(file);
        }
        return all;
    };

    const control = AtomControl.from(e.currentTarget);
    control.app.runAsync(async() => {
        for await (const handle of fileHandlesPromises) {
            if (handle.kind === "directory" || handle.isDirectory) {
                files.push(... await getFiles(handle));
            } else {
                files.push(await handle.getFile());
            }
        }
        const detail = {
            files,
            extra,
            uploadEvent
        };
        // console.log(detail);
        currentTarget.dispatchEvent(new CustomEvent("uploadRequested", { detail, bubbles: true, cancelable: true}));
        // console.log(files);
    });

};

export const FilesDragDrop = ({
    uploadEvent = "files-available",
    uploadRequested = "upload-requested",
    extra = "",
}) => ({
    "data-extra": extra,
    "data-drag-drop": "1",
    "data-upload-event": uploadEvent,
    "data-upload-requested": uploadRequested,
    "event-dragenter": dragEnter,
    "event-dragleave": dragLeave,
    "event-dragover": dragOver,
    "event-drop": eventDrop
});