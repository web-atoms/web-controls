import { App } from "@web-atoms/core/dist/App";
import Command from "@web-atoms/core/dist/core/Command";
import EventScope from "@web-atoms/core/dist/core/EventScope";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import PopupService from "@web-atoms/core/dist/web/services/PopupService";

const acceptCache = {};

export const isFileType = (acceptType: string) => {

    function isFileTypeFactory(accept: string): ((file: File) => boolean) {
        // Accept ny file
        if (!accept || accept === "*/*") {
            return () => true;
        }
        const types = accept.split(/\,/g).map((x) => {
            x = x.trim();
            if (x.startsWith(".")) {
                return (file: File) => file.name.endsWith(x);
            }
            if (x.endsWith("/*")) {
                const prefix = x.substring(0, x.length - 1);
                return (file: File) => file.type.startsWith(prefix);
            }
            return (file: File) => file.type === x;
        });
        return (file: File) => {
            for (const iterator of types) {
                if (iterator(file)) {
                    return true;
                }
            }
            return false;
        };
    }

    return acceptCache[acceptType] ??= isFileTypeFactory(acceptType);
};

export type FilesAvailableEventArgs<T = any> = CustomEvent<{ files: File[], extra: T }>;

export interface IUploadParams<T = any> {
    "event-files-available"?: (ce: FilesAvailableEventArgs<T>) => any,
    uploadEvent?: string;
    accept?: string,
    capture?: string;
    multiple?: any;
    /** Will enforce that the selected file matches the given accept types */
    forceType?: boolean;
    maxSize?: number;
    upload?: boolean;
    /** Extra will hold other information that will be available in upload event */
    extra?: T;
    authorize?: boolean;
    ariaLabel?: string;
} 

const requestUpload = new Command();

let previousFile: HTMLInputElement;

requestUpload.eventScope.listen((ce: CustomEvent) => {
    const element = ce.target as HTMLElement;
    const authorize = element.dataset.authorize;
    if (authorize === "true") {
        if(!App.authorize()) {
            return;
        }
    }

    const multiple = element.dataset.multiple === "true";
    const extra = (element as any).extra;
    const upload = element.dataset.upload === "true";
    const uploadEvent = element.getAttribute("data-upload-event");

    const chain: HTMLElement[] = [];
    let start = element;
    while(start) {
        chain.push(start);
        start = start.parentElement;
    }

    previousFile?.remove();
    const file = document.createElement("input");
    file.type = "file";
    file.multiple = multiple;
    const accept = element.dataset.accept || "*/*";
    file.accept = accept;
    const capture = element.dataset.capture;
    if (capture) {
        file.capture = capture;
    }
    file.style.position = "absolute";
    file.style.left = "-1000px";
    file.style.top = "-1000px";
    document.body.append(file);
    previousFile = file;
    const maxSize = parseInt(element.dataset.maxSize || "0", 10);
    const forceType = element.dataset.forceType === "true";

    file.addEventListener("change", () => {
        let files = Array.from(file.files);

        let msg = "";

        if (forceType || maxSize) {
            
            const validated = [];

            const checkFileType = isFileType(accept);

            for (const iterator of files) {
                if (maxSize && iterator.size > maxSize) {
                    msg += `Size of ${iterator.name} is more than ${maxSize}`;
                    continue;
                }
                if (forceType) {
                    if (!checkFileType(iterator)) {
                        msg += `${iterator.name} is invalid file.`;
                        continue;
                    }
                }
                validated.push(iterator);
            }

            files = validated;
        }

        file.remove();
        previousFile = null;

        chain.reverse();
        while(chain.length) {
            const root = chain.pop();
            if (root.isConnected) {

                const control = AtomControl.from(root);
                if (msg) {
                    control.app.runAsync(() => PopupService.alert({ message: msg}));
                    if (files.length === 0) {
                        return;
                    }
                }
                // if (upload) {
                //     (window as any).uploading = true;
                //     control.app.runAsync(async () => {
                //         try {
                //             const afs = await UploadFilesWindow.showModal({ parameters: { files, uploadEvent}});
                //             root.dispatchEvent(new CustomEvent(uploadEvent, { detail: { files: afs, extra }, bubbles: true}));
                //         } finally {
                //             (window as any).uploading = false;
                //         }
                //     });
                //     break;
                // }
                root.dispatchEvent(new CustomEvent(uploadEvent, { detail: {
                    files,
                    extra
                }, bubbles: true }));
                break;
            }
        }
    });

    setTimeout(() => {
        file.dispatchEvent(new MouseEvent("click"));
    });
});


let id = 1;

export default class UploadEvent {

    public static AttachUploadAction({
        uploadEvent = "filesAvailable",
        accept = "*/*",
        capture,
        multiple = false,
        forceType = true,
        maxSize = 524288000,
        extra,
        upload = true,
        authorize = true,
        ariaLabel = "Upload",
        ... others
    }: IUploadParams) {
        return {
            ... others,
            ... requestUpload.registerOnClick(""),
            "data-upload-event": uploadEvent,
            "data-accept": accept,
            "data-multiple": multiple ? "true" : "false",
            "data-capture": capture,
            "data-upload": upload ? "true" : "false",
            "data-force-type": forceType ? "true" : "false",
            "data-max-size" : maxSize ? maxSize.toString() : undefined,
            "data-authorize": authorize.toString(),
            "aria-label": ariaLabel,
            extra,
        };
    }
}