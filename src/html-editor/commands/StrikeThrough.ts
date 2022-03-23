import Command, { ICommand } from "./Command";

export default function StrikeThrough(cmd: ICommand) {
    return Command({
        icon: "ri-strikethrough",
        queryState: "strikeThrough",
        title: "Strike Through",
        ... cmd,
        command(editor) {
            editor.executeCommand("strikeThrough");
        }
    });
}
