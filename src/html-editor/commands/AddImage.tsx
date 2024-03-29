import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import PopupService, { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import FormField from "../../basic/FormField";
import type AtomHtmlEditor from "../AtomHtmlEditor";
import CommandButton, { notSet } from "./CommandButton";
import HtmlCommands from "./HtmlCommands";

class ImageDialog extends PopupWindow {

    @BindableProperty
    public link: string;

    @BindableProperty
    public alt: string;

    protected create(): void {
        this.link = "";
        this.alt = "";
        this.render(<div>
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
        </div>);
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
