import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomToggleButtonBar } from "@web-atoms/core/dist/web/controls/AtomToggleButtonBar";
import PopupService, { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import FormField from "../../basic/FormField";
import type AtomHtmlEditor from "../AtomHtmlEditor";
import CommandButton, { notSet } from "./CommandButton";
import HtmlCommands from "./HtmlCommands";
import styled from "@web-atoms/core/dist/style/styled";

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

const linkDialogCss = styled.css `
    display: flex;
    flex-direction: column;
    gap: 5px;
`.installLocal();

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
                <AtomToggleButtonBar
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
