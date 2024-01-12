import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import PopupService, { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import type AtomHtmlEditor from "../AtomHtmlEditor";
import CommandButton from "./CommandButton";
import HtmlCommands from "./HtmlCommands";
import styled from "@web-atoms/core/dist/style/styled";

const css = styled.css `
    & > textarea {
        min-height: 500px;
        min-width: 700px;
    }
`.installLocal();

async function showDialog(s: AtomHtmlEditor, e: Event): Promise<string> {

    class SourceDialog extends PopupWindow {

        @BindableProperty
        public source: string;

        protected create(): void {
            this.source = s.htmlContent;
            this.render(<div class={css}>
                <textarea value={Bind.twoWaysImmediate(() => this.source)}/>
                <div class="command-bar">
                    <button
                        eventClick={Bind.event(() => this.close(this.source))}
                        text="Save"/>
                </div>
            </div>);
        }

    }

    const result = await PopupService.showWindow(s.element, SourceDialog);
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
