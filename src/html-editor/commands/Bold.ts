import Command, { ICommand } from "./Command";

export default function Bold(cmd: ICommand) {
    return Command({
        icon: "ri-bold",
        queryState: "bold",
        title: "Bold",
        ... cmd,
        command(editor) {
            editor.executeCommand("bold");
        }
    });
}
