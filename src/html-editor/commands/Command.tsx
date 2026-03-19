import Bind from "@web-atoms/core/dist/core/Bind.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import type AtomHtmlEditor from "../AtomHtmlEditor.js";

export interface ICommand {
    label?: string;
    icon?: string;
    queryState?: string;
    enabled?: boolean;
    title?: string;
    command?: (editor: AtomHtmlEditor) => void;
    query?: (editor: AtomHtmlEditor) => boolean;
}

export default function Command({
    icon,
    label,
    command,
    queryState = "none",
    query,
    ... others
}: ICommand) {
    if (label) {
        return <div
            eventClick={Bind.event((e) => command(e as AtomHtmlEditor))}
            styleClass={Bind.oneWay((e: AtomHtmlEditor) => ({
                command: e.version,
                pressed: !e.queryCommandState(queryState)
            }))}
            { ... others }>
            <i class={icon}/>
            <label class="label" text={label}/>
        </div>;
    }
    return <div
        eventClick={Bind.event((e) => command(e as AtomHtmlEditor))}
        styleClass={Bind.oneWay((e: AtomHtmlEditor) => ({
            command: e.version,
            pressed: e.queryCommandState(queryState)
        }))}
        { ... others }>
        <i class={icon}/>
    </div>;
}
