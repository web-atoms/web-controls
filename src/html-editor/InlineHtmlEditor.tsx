import XNode from "@web-atoms/core/dist/core/XNode";
import sleep from "@web-atoms/core/dist/core/sleep";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { descendentElementIterator } from "@web-atoms/core/dist/web/core/AtomUI";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

CSS(StyleRule()
    .child(StyleRule("[data-element=toolbar]")
        .verticalFlexLayout({})
        .child(StyleRule(".toolbar")
            .flexLayout({})
            .nested(StyleRule(".command")
                .and(StyleRule(".pressed")
                    .fontWeight("bold")
                )
            )
        )
    )
, "[data-inline-editor=inline-editor]");

export default class InlineHtmlEditor extends AtomControl {

    public "event-content-changed"?: (ce: CustomEvent<string>) => any;
    public "event-content-ready"?: (ce: CustomEvent<HTMLElement>) => any;
    public "event-load-suggestions"?: (ce: CustomEvent<string>) => any;

    public editableSelector: string = ".editable";

    public get htmlContent() {
        return this.content;
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
        // document.execCommand(command, showUI, value);
        // debugger;
        // restore selection
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this.selection);
        document.execCommand(command, showUI, value);
    }

    protected queryCommandState(command: string) {
        return document.queryCommandState(command);
    }

    protected onContentSet() {

        const start = this.editor.querySelector(this.editableSelector) as HTMLElement;
        if (start) {
            start.contentEditable = "true";
        } else {
            (this.editor.firstElementChild as HTMLElement).contentEditable = "true";
        }

        this.editor.dispatchEvent(new CustomEvent("contentReady", { detail: this.editor.innerHTML, bubbles: true }));
    }

    protected saveSelection() {
        const selection = window.getSelection();
        this.selection = selection.rangeCount === 0 ? null : selection.getRangeAt(0);
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
        this.bindEvent(this.editor, "paste", () => this.onContentInput());
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
