import Command from "./Command";

export default function RemoveFormat(cmd: any) {
    return Command({
        icon: "ri-format-clear",
        queryState: "removeFormat",
        title: "Clear Formatting",
        ... cmd,
        command(editor) {
            editor.executeCommand("removeFormat");
        }
    });
}
