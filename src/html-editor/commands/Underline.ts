import Command, { ICommand } from "./Command";

export default function Underline(cmd: ICommand) {
    return Command({
        icon: "ri-underline",
        queryState: "underline",
        title: "Underline",
        ... cmd,
        command(editor) {
            editor.executeCommand("underline");
        }
    });
}
