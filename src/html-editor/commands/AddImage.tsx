import CommandButton, { notSet } from "./CommandButton";

export default function AddImage({
    eventInsertHtml = notSet("AddImage"),
    insertCommand = "insertHTML"
}) {
    return CommandButton({
        icon: "ri-image-add-fill",
        insertCommand,
        title: "Insert Image",
        eventInsertHtml
    });
}
