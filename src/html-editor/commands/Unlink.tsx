import Command from "./Command";

export default function Unlink(cmd: any) {
    return Command({
        icon: "ri-link-unlink-m",
        queryState: "unlink",
        title: "Remove Link",
        ... cmd,
        command(editor) {
            editor.executeCommand("unlink");
        }
    });
}
