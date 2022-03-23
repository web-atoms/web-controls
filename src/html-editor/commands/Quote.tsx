import Command from "./Command";

export default function IndentMore(cmd: any) {
    return Command({
        icon: "ri-double-quotes",
        queryState: "formatBlock",
        title: "Insert Quote",
        ... cmd,
        command(editor) {
            editor.executeCommand("formatBlock");
        }
    });
}
