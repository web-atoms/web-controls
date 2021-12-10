import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomToggleButtonBar } from "@web-atoms/core/dist/web/controls/AtomToggleButtonBar";
import PopupService, { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import FormField from "../../basic/FormField";
import type { HtmlEditorControl } from "../HtmlEditor";
import CommandButton, { notSet } from "./CommandButton";

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

const linkDialogCss = CSS(StyleRule()
    .display("flex")
    .flexDirection("column")
    .gap(5)
);

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
                    eventClick={Bind.event(() => this.viewModel.close(this.toLink(this.link)))} />
            </div>
        </div>);
    }

    private toLink(link: string): string {
        switch (this.type) {
            case "web-page":
                return /^(http|https)\:\/\//.test(link) ? link : "";
        }
    }
}

function showDialog(s: HtmlEditorControl, e: Event): Promise<string> {
    return PopupService.showWindow(s.element, LinkDialog);
}

export default function AddLink({
    insertCommand = "createLink"
}) {
    return CommandButton({
        icon: "ri-link-m",
        insertCommand,
        eventInsertHtml: showDialog,
        title: "Create Hyper Link"
    });
}
