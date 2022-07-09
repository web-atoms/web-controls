import AtomHtmlEditor from "../AtomHtmlEditor";
import CommandButton from "./CommandButton";
import HtmlCommands from "./HtmlCommands";

function promptForFiles(
    accept = "*",
    multiple = true
) {
    const file = document.createElement("input");
    file.type = "file";
    file.multiple = multiple;
    file.accept = accept;
    file.style.position = "absolute";
    file.style.left = "-1000px";
    file.style.top = "-1000px";
    document.body.append(file);
    const previous = file;
    return new Promise<File[]>((resolve, reject) => {
        file.addEventListener("change", () => {
            if (file.files.length) {
                const files = Array.from(file.files);
                resolve(files);
            } else {
                reject("cancelled");
            }
            if (previous) {
                previous.remove();
            }
        });
        file.dispatchEvent(new MouseEvent("click"));
    });
}

export default function AttachFile({
    eventInsertHtml = (source: AtomHtmlEditor, e: Event) => {
        const ce = new CustomEvent("attachFile",
        {
            detail: {
                source,
                files: source.files
            },
            cancelable: true
        });
        source.element.dispatchEvent(ce);
        if (ce.defaultPrevented) {
            return;
        }
        source.app.runAsync(async () => {
            const result = await promptForFiles();
            source.files ??= [];
            source.files.addAll(result);
        })
    },
    insertCommand = HtmlCommands.insertImage
}) {
    return CommandButton({
        icon: "ri-attachment-2",
        insertCommand,
        disabled: false,
        title: "Insert Image",
        eventInsertHtml
    });
}
