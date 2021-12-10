import Command from "./Command";

export default function IndentMore(cmd: any) {
    return Command({
        icon: "ri-indent-increase",
        queryState: "indent",
        title: "Indent More",
        ... cmd,
        command(editor) {
            editor.executeCommand("indent");
        }
    });
}
