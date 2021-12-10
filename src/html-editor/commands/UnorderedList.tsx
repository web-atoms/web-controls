import Command from "./Command";

export default function UnorderedList(cmd: any) {
    return Command({
        icon: "ri-list-unordered",
        queryState: "insertUnorderedList",
        title: "Create List",
        ... cmd,
        command(editor) {
            editor.executeCommand("insertUnorderedList");
        }
    });
}
