import Bind from "@web-atoms/core/dist/core/Bind.js";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import PopupService, { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService.js";
import FormField from "../../basic/FormField.js";
import type AtomHtmlEditor from "../AtomHtmlEditor.js";
import CommandButton, { notSet } from "./CommandButton.js";
import HtmlCommands from "./HtmlCommands.js";

class ImageDialog extends PopupWindow {

    @BindableProperty
    public link: string;

    @BindableProperty
    public alt: string;

    init() {
        this.link = "";
        this.alt = "";
        this.renderer = <div>
            <FormField label="Url">
                <input value={Bind.twoWaysImmediate(() => this.link)}/>
            </FormField>
            <FormField label="Alt">
                <input value={Bind.twoWaysImmediate(() => this.alt)}/>
            </FormField>
            <div class="command-bar">
                <button
                    eventClick={() => this.close(this.createImage())}
                    text="Add"/>
            </div>
        </div>;
    }

    private createImage() {
        if (this.alt) {
            return `<img src="${this.link}" alt="${this.alt}" />`;
        }
        return `<img src="${this.link}"/>`;
    }
}

export function showImageDialog(s: AtomHtmlEditor, e: Event): Promise<string> | string {
    return PopupService.showWindow<string>(e.currentTarget as HTMLElement, ImageDialog, { title: "Add Image" });
}

export default function AddImage({
    eventInsertHtml = (s: AtomHtmlEditor, e: Event) => s.insertImage(s, e),
    insertCommand = HtmlCommands.insertImage
}) {
    return CommandButton({
        icon: "ri-image-add-fill",
        insertCommand,
        disabled: false,
        title: "Insert Image",
        eventInsertHtml
    });
}
