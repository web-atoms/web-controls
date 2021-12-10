import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import type { HtmlEditorControl } from "../HtmlEditor";

export interface ICommand {
    label?: string;
    icon?: string;
    queryState?: string;
    enabled?: boolean;
    title?: string;
    command?: (editor: HtmlEditorControl) => void;
    query?: (editor: HtmlEditorControl) => boolean;
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
            eventClick={Bind.event((e) => command(e as HtmlEditorControl))}
            styleClass={Bind.oneWay((e: HtmlEditorControl) => ({
                command: e.version,
                pressed: !e.queryCommandState(queryState)
            }))}
            { ... others }>
            <i class={icon}/>
            <label class="label" text={label}/>
        </div>;
    }
    return <div
        eventClick={Bind.event((e) => command(e as HtmlEditorControl))}
        styleClass={Bind.oneWay((e: HtmlEditorControl) => ({
            command: e.version,
            pressed: e.queryCommandState(queryState)
        }))}
        { ... others }>
        <i class={icon}/>
    </div>;
}
