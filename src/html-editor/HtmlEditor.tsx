import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AddImage, { showImageDialog } from "./commands/AddImage";
import AddLink from "./commands/AddLink";
import Align from "./commands/Align";
import Bold from "./commands/Bold";
import ChangeColor from "./commands/ChangeColor";
import ChangeFont from "./commands/ChangeFont";
import ChangeFontSize from "./commands/ChangeFontSize";
import Headings from "./commands/Headings";
import HorizontalRule from "./commands/HorizontalRule";
import IndentLess from "./commands/IndentLess";
import IndentMore from "./commands/IndentMore";
import Italic from "./commands/Italic";
import NumberedList from "./commands/NumberedList";
import RemoveFormat from "./commands/RemoveFormat";
import Separator from "./commands/Separator";
import Source from "./commands/Source";
import StrikeThrough from "./commands/StrikeThrough";
import Underline from "./commands/Underline";
import Unlink from "./commands/Unlink";
import UnorderedList from "./commands/UnorderedList";

const link = document.createElement("link");
link.href = "https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css";
link.rel = "stylesheet";
document.head.appendChild(link);

const css = CSS(StyleRule()
    .display("flex")
    .flexDirection("column")
    .minHeight(500)
    .child(StyleRule("iframe")
        .flexStretch()
    )
    .nested(StyleRule(".toolbar")
        .display("flex")
        .child(StyleRule(".command")
            .display("inline-flex")
            .justifyContent("space-evenly" as any)
            .border("none")
            .cursor("pointer")
            .backgroundColor(Colors.transparent)
            .hoverBackgroundColor(Colors.lightGreen)
            .minWidth(28)
            .height(28)
            .and(StyleRule(".pressed")
                .backgroundColor(Colors.lightGray)
                .hoverBackgroundColor(Colors.lightGreen)
            )
            .nested(StyleRule(".ri-bold")
                .fontWeight("bold")
            )
        )
    )
);

export function Toolbar(a: any, ... nodes: XNode[]) {
    return <div class="toolbar">
        { ... nodes}
    </div>;
}

function preventLinkClick(e: Event) {
    let target = e.target as HTMLElement;
    const body = document.body;
    while (target && target !== body) {
        if (target.isContentEditable) {
            break;
        }
        if (target.tagName === "A") {
            if (!target.isContentEditable) {
                e.preventDefault();
                return false;
            }
            break;
        }
        target = target.parentElement;
    }
}

export default class HtmlEditor extends AtomControl {

    @BindableProperty
    public content: string;

    @BindableProperty
    public header: any[];

    @BindableProperty
    public version: number;

    public editor: HTMLDivElement;

    public eventDocumentCreated: (e: CustomEvent<HTMLDivElement>) => void;

    public eventDocumentUpdated: (e: CustomEvent<HTMLDivElement>) => void;

    public get htmlContent(): string {
        try {
            return this.editor.innerHTML;
        } catch (ex) {
            // tslint:disable-next-line: no-console
            console.warn(ex);
        }
    }

    public set htmlContent(v: string) {
        this.editor.innerHTML = v;
        AtomBinder.refreshValue(this, "htmlContent");
    }

    private editorWindow: Window;

    private editorDocument: Document;

    public insertImage(s: HtmlEditor, e: Event) {
        return showImageDialog(s, e);
    }

    public executeCommand(cmd, showUI?: boolean, value?: string): boolean {
        const r = this.editorDocument.execCommand(cmd, showUI, value);
        setTimeout(() => this.version++, 1);
        return r;
    }

    public queryCommandState(cmd: string, ... a: any[]): boolean {
        return this.editorDocument.queryCommandState(cmd);
    }

    public getStyle(name: string, v: any): string {
        try {
            const node = this.editorWindow.getSelection().getRangeAt(0);
            const e = node.startContainer.parentElement as HTMLElement;
            return this.editorWindow.getComputedStyle(e)[name];
        } catch (ex) {
            return null;
        }
    }

    protected preCreate() {
        this.version = 1;
        this.runAfterInit(() => {
            this.setup();
        });
        this.element.classList.add(css);
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
        }
        e.preventDefault();
    }

    protected onInputEvent(e: InputEvent) {
        // tslint:disable-next-line: no-console
        console.log(e);
    }

    protected setup() {
        const frame = this.element.getElementsByTagName("iframe")[0] as HTMLIFrameElement;
        const doc = frame.contentWindow.document;
        doc.open();
        doc.writeln(`<div id="editor"><p>&nbsp;</p></div>`);
        doc.close();
        const style = doc.createElement("style");
        style.textContent = `body {
            font-family: arial,sans-serif
        }
        #editor {
            min-height: 500px;
        }
        `;
        doc.head.appendChild(style);

        // const script = doc.createElement("script");
        // script.textContent = `document.body.addEventListener("click", ${preventLinkClick.toString()});`;
        // doc.body.appendChild(script);
        doc.body.addEventListener("click", preventLinkClick);

        this.editor = doc.getElementById("editor") as HTMLDivElement;
        this.editor.contentEditable = "true";
        doc.execCommand("styleWithCSS");
        doc.execCommand("insertBrOnReturn");
        const updateVersion = () => setTimeout(() => {
            this.version++;
            AtomBinder.refreshValue(this, "htmlContent");
            this.element.dispatchEvent(new CustomEvent<HTMLDivElement>("documentUpdated", {
                detail: this.editor
            }));
            this.documentUpdated(this.editor);
        }, 1);
        this.editor.addEventListener("click", updateVersion);
        this.editor.addEventListener("keydown", updateVersion);
        this.editor.addEventListener("keypress", updateVersion);
        this.editor.addEventListener("input", updateVersion);
        this.editorWindow = frame.contentWindow;
        this.editorDocument = doc;

        updateVersion();

        this.documentCreated(this.editor);
        this.element.dispatchEvent(new CustomEvent<HTMLDivElement>("documentCreated", {
            detail: this.editor
        }));

        this.registerDisposable({
            dispose: () => {
                this.editor.removeEventListener("click", updateVersion);
                this.editor.removeEventListener("keydown", updateVersion);
                this.editor.removeEventListener("keypress", updateVersion);
                this.editor.removeEventListener("input", updateVersion);
            }
        });
    }

    protected documentCreated(e: HTMLDivElement) {
        // nothing...
    }

    protected documentUpdated(e: HTMLDivElement) {
        // nothing...
    }

    protected render(node: XNode, e?: any, creator?: any): void {
        // following line will prevent stack overflow
        this.render = super.render;
        if (!node.children || node.children.length === 0 ) {
            node.children[0] = <Toolbar>
            <Bold/>
                <Italic/>
                <Underline/>
                <StrikeThrough/>
                <Align/>
                <Separator/>
                <Headings/>
                <ChangeColor/>
                <HorizontalRule/>
                <Separator/>
                <ChangeFont/>
                <ChangeFontSize/>
                <Separator/>
                <NumberedList/>
                <UnorderedList/>
                <IndentLess/>
                <IndentMore/>
                <Separator/>
                <AddImage/>
                <Separator/>
                <AddLink/>
                <Unlink/>
                <RemoveFormat/>
                <Separator/>
                <Source/>
            </Toolbar>;
        }
        super.render(<div {... node.attributes}>
            { ... node.children as any[]}
            <iframe class="editor-frame"/>
        </div>);
    }
}
