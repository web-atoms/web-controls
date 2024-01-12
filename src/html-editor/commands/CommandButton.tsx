import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import type AtomHtmlEditor from "../AtomHtmlEditor";
import { IHtmlCommand } from "./HtmlCommands";

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
    insertCommand: IHtmlCommand;

    /**
     * Tooltip
     */
    title?: string;

    /**
     * setup if command is disabled or not
     */
    disabled?: boolean;
}

export function notSet(text: string) {
    return () => {
        alert(`Command ${text} not set`);
    };
}

function insert(callback: (s: AtomHtmlEditor, e: Event) => Promise<string> | string, command: IHtmlCommand): any {
    return async (s: AtomHtmlEditor, e: Event) => {
        let r = callback(s, e);
        if (typeof r !== "string") {
            if (r?.then) {
                r = await r;
            }
        }
        if (r) {
            if (command) {
                command.execute(s, false, r as string);
            } else {
                s.executeCommand("insertHTML", false, r as string);
            }
        }
    };
}

export default function CommandButton({
    icon,
    label,
    eventInsertHtml,
    insertCommand,
    title,
    disabled
}: ICommandButton) {

    disabled ??= Bind.oneWay((x: AtomHtmlEditor) => x.version
    ? !insertCommand.canExecute(x)
    : false);

    if (label) {
        return <button
            class="command"
            data-layout="toolbar-button"
            disabled={disabled}
            eventClick={Bind.event(insert(eventInsertHtml, insertCommand))}
            title={title}>
            <label class="label">
                <i class={icon} />
                <span text={label}/>
            </label>
        </button>;
    }
    return <button
        data-layout="toolbar-button"
        title={title}
        class="command"
        disabled={disabled}
        eventClick={Bind.event(insert(eventInsertHtml, insertCommand))}>
        <i class={icon} />
    </button>;
}
