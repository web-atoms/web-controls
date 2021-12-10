import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import type { HtmlEditorControl } from "../HtmlEditor";

export interface ICommandButton {
    icon?: string;
    label?: string;
    /**
     * On click, you must return a promise of string or a string that will be inserted
     */
    eventInsertHtml?: any;

    /**
     * Default is insertHTML but you can change it.
     */
    insertCommand: any;

    /**
     * Tooltip
     */
    title?: string;
}

export function notSet(text: string) {
    return () => {
        alert(`Command ${text} not set`);
    };
}

function insert(callback: (s: HtmlEditorControl, e: Event) => Promise<string> | string, command: string): any {
    return async (s: HtmlEditorControl, e: Event) => {
        let r = callback(s, e);
        if (typeof r !== "string") {
            if (r.then) {
                r = await r;
            }
        }
        if (r) {
            s.executeCommand(command ?? "insertHTML", false, r as string);
        }
    };
}

export default function CommandButton({
    icon,
    label,
    eventInsertHtml,
    insertCommand,
    title
}: ICommandButton) {
    if (label) {
        return <button
            class="command"
            eventClick={Bind.event(insert(eventInsertHtml, insertCommand))}
            title={title}>
            <label class="label">
                <i class={icon} />
                <span text={label}/>
            </label>
        </button>;
    }
    return <button
        title={title}
        class="command"
        eventClick={Bind.event(insert(eventInsertHtml, insertCommand))}>
        <i class={icon} />
    </button>;
}