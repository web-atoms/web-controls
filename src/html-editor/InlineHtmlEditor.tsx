import XNode from "@web-atoms/core/dist/core/XNode";
import sleep from "@web-atoms/core/dist/core/sleep";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { ChildEnumerator, descendentElementIterator } from "@web-atoms/core/dist/web/core/AtomUI";

import "@web-atoms/data-styles/data-styles";
import { showImageDialog } from "./commands/AddImage";
import { FilesAvailableEventArgs } from "../basic/UploadEvent";
import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

    & > [data-element=toolbar] {
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        gap: 4px;
        display: flex;

        & > .toolbar {
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            gap: 4px;
            display: flex;

            & .command {

                &.pressed {
                    font-weight: bold;
                }
            }
        }
    }
    `.installGlobal("[data-inline-editor=inline-editor]")

export default class InlineHtmlEditor extends AtomControl {

    /**
     * Maximum undo limit
     */
    public undoLimit = 100;

    public "event-content-changed"?: (ce: CustomEvent<string>) => any;
    public "event-content-ready"?: (ce: CustomEvent<HTMLElement>) => any;
    public "event-load-suggestions"?: (ce: CustomEvent<string>) => any;
    public "event-files-available"?: (ce: FilesAvailableEventArgs) => any;

    public editableSelector: string = ".editable";

    public sanitizeHtml: (node: HTMLElement) => void;

    /**
     * This will return the html content
     * after sanitizing everything, removing editable
     * attributes etc.
     */
    public get htmlContent() {
        // we will sanitize...
        // remove editable
        const copy = document.createElement("div");
        copy.innerHTML = this.editor.innerHTML;

        for(const node of descendentElementIterator(copy)) {
            (node as HTMLElement).contentEditable = "false";
        }

        this.sanitizeHtml?.(copy);

        return copy.innerHTML;
    }

    public set htmlContent(v: string) {
        this.content = v;
    }

    public get content() {
        return this.editor.innerHTML;
    }

    public set content(value: string) {
        this.editor.innerHTML = value;
        setTimeout(() => this.onContentSet(), 100);
    }

    public set toolbar(v: () => XNode) {
        this.dispose(this.toolbarElement);
        this.toolbarElement.innerHTML = "";
        this.render(v(), this.toolbarElement, this);
    }

    private version: number;

    private selection: Range;

    private editor: HTMLElement;

    private toolbarElement: HTMLElement;

    private token: CancelToken;

    protected executeCommand(command: string, showUI?: boolean, value?: string) {
        // restore selection...
        const selection = window.getSelection();
        selection.removeAllRanges();
        if (!this.selection) {
            const range = document.createRange();
            // find editable...
            const start = ChildEnumerator.find(this.editor, (x) => x.isContentEditable) ?? this.editor.firstElementChild;
            range.setEndAfter(start.lastChild);
            range.setStartAfter(start.lastChild);
            selection.addRange(range);
        } else {
            selection.addRange(this.selection);
        }
        return document.execCommand(command, showUI, value);
        // // debugger;
        // // restore selection
        // const selection = window.getSelection();
        // selection.removeAllRanges();
        // const range = this.selection;
        // // document.execCommand(command, showUI, value);
        // const cmd = RangeEditorCommands[command];
        // if (cmd) {
        //     RangeEditor.updateRange({
        //         ... cmd,
        //         value,
        //         range,
        //     });
        // }
        // selection.addRange(range);
    }

    protected getStyle(name: string) {
        
        const selection = this.selection;
        if (!selection) {
            return void 0;
        }
        const node = selection;
        const e = node.startContainer.parentElement as HTMLElement;
        return window.getComputedStyle(e)[name];        // const range = selection.getRangeAt(0);
        // const container = range.commonAncestorContainer;
        // if(container.nodeType === Node.ELEMENT_NODE) {
        //     return window.getComputedStyle(container as HTMLElement)[name];
        // }
        // return void 0;
    }

    protected queryCommandState(command: string) {
        return document.queryCommandState(command);
        // const selection = this.selection;
        // if (!selection) {
        //     return;
        // }
        // const range = selection;
        // const cmd = RangeEditorCommands[command];
        // if (cmd) {
        //     return RangeEditor.checkRange({
        //         ... cmd,
        //         range,
        //     });
        // }
    }

    protected onContentSet() {

        const start = (
            Array.from(this.editor.querySelectorAll<HTMLElement>(this.editableSelector))
            ??
            [this.editor.firstElementChild as HTMLElement]
        );
        if (start.length) {
            for (const iterator of start) {
                iterator.contentEditable = "true";
            }
        }
        this.editor.dispatchEvent(new CustomEvent("contentReady", { detail: this.editor.innerHTML, bubbles: true }));
    }

    protected saveSelection() {
        const selection = window.getSelection();
        this.selection = selection.rangeCount === 0 ? null : selection.getRangeAt(0);
    }

    public insertImage(s: any, e: Event) {
        return showImageDialog(s, e);
    }

    protected preCreate(): void {
        this.version = 1;
        this.element.setAttribute("data-inline-editor", "inline-editor");
        this.render(<div>
            <div data-element="toolbar"/>
            <div data-element="editor"/>
        </div>);

        this.editor = this.element.querySelector(`[data-element=editor]`);
        this.toolbarElement = this.element.querySelector(`[data-element=toolbar]`);

        this.bindEvent(this.editor, "blur", () => this.saveSelection(), void 0, true);
        this.bindEvent(this.editor, "input", (e: InputEvent) => this.onContentInput(e));
        this.bindEvent(this.editor, "keydown", (e: KeyboardEvent) => this.updateQueryCommand());
        this.bindEvent(this.editor, "click", (e: KeyboardEvent) => this.updateQueryCommand());
        this.bindEvent(this.editor, "paste", (e: ClipboardEvent) => this.onPasteEvent(e));
        this.bindEvent(this.editor, "cut", () => this.onContentInput());
        this.bindEvent(this.editor, "drop", (e: DragEvent) => this.onDrop(e));
    }

    protected updateQueryCommand() {
        this.version++;
    }

    protected onDrop(e: DragEvent) {
        e.preventDefault();
        const text = e.dataTransfer.getData("text/plain");
        if (!text) {
            return;
        }
        let last: HTMLElement = null;
        for (const node of descendentElementIterator(this.element)) {
            if ((node as HTMLElement).isContentEditable) {
                last = node as HTMLElement;
                continue;
            }
        }
        if (last) {
            last.appendChild(document.createTextNode(text));
        }
    }

    protected onPasteEvent(e: ClipboardEvent) {
        // tslint:disable-next-line: no-console
        if (!e.clipboardData.types.find((x) => x === "text/html")) {
            return;
        }

        const d = e.clipboardData.getData("text/plain");
        if (d) {
            // we need to sanitize this one...
            const s = window.getSelection();
            const r = s.getRangeAt(0);
            const p = document.createElement("p");
            const span = document.createElement("span");
            span.textContent = d;
            p.appendChild(span);
            r.insertNode(p);
            r.setStartAfter(p);
            this.onContentInput();
        }
        e.preventDefault();
    }

    protected contentModified() {
        this.element.dispatchEvent(new CustomEvent("contentChanged", { detail: this.editor.innerHTML, bubbles: true }));
    }

    private onContentInput(e?: InputEvent) {
        this.token?.cancel();
        const token = this.token = new CancelToken();
        this.app.runAsync(async () => {
            await sleep(500, token, false);
            if(token.cancelled) {
                return;
            }
            this.contentModified();
        });
    }

}
