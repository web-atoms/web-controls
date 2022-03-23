import Command, { ICommand } from "./Command";

export default function Italic(cmd: ICommand) {
    return Command({
        icon: "ri-italic",
        queryState: "italic",
        title: "Italic",
        ... cmd,
        command(editor) {
            editor.executeCommand("italic");
        }
    });
}
