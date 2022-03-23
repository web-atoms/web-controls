import CommandButton from "./CommandButton";
import HtmlCommands from "./HtmlCommands";

export default function Unlink({
    insertCommand = HtmlCommands.unlink
}) {
    return CommandButton({
        icon: "ri-link-unlink-m",
        insertCommand,
        eventInsertHtml: () => "",
        title: "Remove Hyperlink"
    });
}
