import CommandButton from "./CommandButton.js";
import HtmlCommands from "./HtmlCommands.js";

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
