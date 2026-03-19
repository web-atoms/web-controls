import Command, { ICommand } from "./Command.js";

export default function HorizontalRule(cmd: ICommand) {
    return Command({
        icon: "ri-separator",
        title: "Insert Horizontal Line",
        ... cmd,
        command(editor) {
            editor.executeCommand("insertHorizontalRule");
        }
    });
}
