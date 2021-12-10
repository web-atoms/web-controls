import Command from "./Command";

export default function NumberedList(cmd: any) {
    return Command({
        icon: "ri-list-ordered",
        queryState: "insertOrderedList",
        title: "Create Numbered List",
        ... cmd,
        command(editor) {
            editor.executeCommand("insertOrderedList");
        }
    });
}
