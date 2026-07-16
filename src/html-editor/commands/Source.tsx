import Bind from "@web-atoms/core/dist/core/Bind.js";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import PopupService, { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService.js";
import type AtomHtmlEditor from "../AtomHtmlEditor.js";
import CommandButton from "./CommandButton.js";
import HtmlCommands from "./HtmlCommands.js";
import "./Source.local.css";

const css = "web-controls-html-editor-source";

async function showDialog(s: AtomHtmlEditor, e: Event): Promise<string> {

    class SourceDialog extends PopupWindow {

        @BindableProperty
        public source: string;

        init() {
            this.source = s.htmlContent;
            this.renderer = <div class={css}>
                <textarea
                    value={Bind.twoWaysImmediate(() => this.source)}/>
                <div class="command-bar">
                    <button
                        eventClick={Bind.event(() => this.close(this.source))}
                        text="Save"/>
                </div>
            </div>;
        }

    }

    const result = await PopupService.showWindow(s.element, SourceDialog, { title: "Source"});
    s.htmlContent = result as string;
    return null;
}

export default function Source({
    insertCommand = HtmlCommands.enabled
}) {
    return CommandButton({
        icon: "ri-edit-box-fill",
        insertCommand,
        eventInsertHtml: showDialog,
        title: "Edit Source Code"
    });
}
