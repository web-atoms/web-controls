import CommandButton, { notSet } from "./CommandButton";

export default function AddLink({
    eventInsertHtml = notSet("CreateLink"),
    insertCommand = "insertHTML"
}) {
    return CommandButton({
        icon: "ri-link-m",
        insertCommand,
        eventInsertHtml,
        title: "Create Hyper Link"
    });
}
