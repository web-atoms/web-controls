import Bind from "@web-atoms/core/dist/core/Bind.js";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import PopupService, { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService.js";
import FormField from "../../basic/FormField.js";
import type AtomHtmlEditor from "../AtomHtmlEditor.js";
import CommandButton, { notSet } from "./CommandButton.js";
import HtmlCommands from "./HtmlCommands.js";
import "./AddLink.local.css";
import ButtonBar from "../../basic/ButtonBar.js";

const linkTypes = [
    {
        label: "Web Page",
        value: "web-page"
    },
    {
        label: "Email",
        value: "email"
    },
    {
        label: "Anchor",
        value: "anchor"
    },
    {
        label: "Phone",
        value: "phone"
    }
];

const linkDialogCss = "html-editor-commands-add-link";

class LinkDialog extends PopupWindow {

    @BindableProperty
    public link: string;

    @BindableProperty
    public type: string;

    protected create(): void {
        this.type = "web-page";
        this.title = "Create Link";
        this.render(<div class={linkDialogCss}>
            <FormField label="Type">
                <ButtonBar
                    items={linkTypes}
                    value={Bind.twoWays(() => this.type)}/>
            </FormField>
            <FormField label="Link" required={true}>
                <input
                    placeholder="https://..."
                    value={Bind.twoWaysImmediate(() => this.link)}/>
            </FormField>
            <div class="command-bar">
                <button
                    text="Add"
                    eventClick={Bind.event(() => this.close(this.toLink(this.link)))} />
            </div>
        </div>);
    }

    private toLink(link: string): string {
        switch (this.type) {
            case "web-page":
                return /^(http|https)\:\/\//.test(link) ? link : `http://${link}`;
        }
    }
}

function showDialog(s: AtomHtmlEditor, e: Event): Promise<string> {
    return PopupService.showWindow(s.element, LinkDialog);
}

export default function AddLink({
    insertCommand = HtmlCommands.createLink
}) {
    return CommandButton({
        icon: "ri-link-m",
        insertCommand,
        disabled: false,
        eventInsertHtml: showDialog,
        title: "Create Hyper Link"
    });
}
