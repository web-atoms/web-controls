import Command from "./Command.js";

export default function IndentLess(cmd: any) {
    return Command({
        icon: "ri-indent-decrease",
        queryState: "outdent",
        title: "Indent Less",
        ... cmd,
        command(editor) {
            editor.executeCommand("outdent");
        }
    });
}
