import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomRepeater from "../basic/AtomRepeater";
import AddImage, { showImageDialog } from "./commands/AddImage";
import AddLink from "./commands/AddLink";
import Align from "./commands/Align";
import AttachFile from "./commands/AttachFile";
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
import Toolbar from "./commands/Toolbar";
import styled from "@web-atoms/core/dist/style/styled";
export { default as Toolbar} from "./commands/Toolbar";

const link = document.createElement("link");
link.href = "https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css";
link.rel = "preload";
link.as = "style";
link.onload = () => {
    link.onload = null;
    link.rel = "stylesheet";
};
document.head.appendChild(link);

const css = styled.css `

    display: flex;
    flex-direction: column;
    min-height: 500px;
    
    & > iframe {
        flex: 1 1 100%; 
    }
    
    & > .files > .file {
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        gap: 4px;
        display: inline-flex;
        border-color: rgba(211,211,211,0.5);
        border-width: 1px;
        border-style: solid;
        border-radius: 15px;
        padding-left: 10px;
        padding-right: 10px; 

        & > label {
            max-width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis; 
        }
    }
    
    
    & .toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        & > .command {
            display: inline-flex;
            align-items: center;
            justify-content: space-evenly;
            border: none;
            cursor: pointer;
            background-color: #00000000;
            min-width: 28px;
            height: 28px; 
        
            &:hover {
                background-color: #90ee90; 
            }
            
            &.pressed {
                background-color: #d3d3d3; 

                &:hover {
                    background-color: #90ee90; 
                }
            }            
            
            & .ri-bold {
                font-weight: bold; 
            }
        }
    }
    `.installLocal();

function preventLinkClick(e: Event, editor: HTMLElement, doc: Document) {
    let target = e.target as HTMLElement;
    const body = doc.body;
    while (target) {
        if (target.getAttribute("data-prompt")) {
            break;
        }
        if (target === body) {
            break;
        }
        if (target.isContentEditable) {
            editor.dispatchEvent(new MouseEvent("click", {
                bubbles: true,
                cancelable: true
            }));
            return;
        }
        if (target.tagName === "A") {
            e.preventDefault();
        }
        target = target.parentElement;
    }

    target = e.target as HTMLElement;
    const originalTarget = target;
    const data = new Proxy(originalTarget, {
        get(target, p) {
            if (typeof p !== "string") {
                return;
            }
            while (target) {
                const value = target.dataset[p];
                if (value !== void 0) {
                    return value;
                }
                target = target.parentElement;
            }
        }
    });

    editor.dispatchEvent(new CustomEvent("editorClick", {
        detail: {
            target,
            data
        },
        bubbles: true,
        cancelable: true
    } ));

    editor.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true
    }));


    // while (target && target !== body) {

    //     const ds = target.dataset;

    //     const command = ds.command;
    //     if (command) {
    //         let commandParameter = ds.commandParameter;
    //         if (!commandParameter) {
    //             commandParameter = ds.commandParameters;
    //             if (commandParameter) {
    //                 commandParameter = JSON.parse(commandParameter);
    //             }
    //         }

    //         // this will force currentTarget/lastTarget to be updated
    //         // in navigation and popup service
    //         editor.dispatchEvent(new CustomEvent("click", {
    //             bubbles: true
    //         }));

    //         editor.dispatchEvent(new CustomEvent<IEditorCommand>("command", {
    //             bubbles: true,
    //             detail: {
    //                 target,
    //                 command,
    //                 commandParameter
    //             }
    //         }));

    //         e.preventDefault();
    //         return;
    //     }

    //     const click = ds.click;
    //     if (click) {
    //         editor.dispatchEvent(new CustomEvent("click", {
    //             bubbles: true
    //         }));

    //         editor.dispatchEvent(new CustomEvent("htmlEditorClick", {
    //             detail: {
    //                 target,
    //                 command: click
    //             }
    //         }));
    //     }

    //     if (target.isContentEditable) {
    //         break;
    //     }
    //     if (target.tagName === "A") {
    //         editor.dispatchEvent(new CustomEvent("click", {
    //             bubbles: true
    //         }));
    //         e.preventDefault();
    //         return false;
    //     }
    //     target = target.parentElement;
    // }
}

export interface IEditorCommand {
    target: HTMLElement;
    command: string;
    commandParameter: string;
}

export interface ITagCommand<T = any> {
    name: string;
    style: any;
    handler: (ce: CustomEvent<{ target: HTMLElement, data: T}>) => any
}

export default class AtomHtmlEditor extends AtomControl {

    @BindableProperty
    public content: string;

    @BindableProperty
    public header: any[];

    @BindableProperty
    public version: number;

    @BindableProperty
    public files: File[];

    public editor: HTMLDivElement;

    @BindableProperty
    public tags: ITagCommand[];

    public eventDocumentCreated: (e: CustomEvent<HTMLDivElement>) => void;

    public eventDocumentUpdated: (e: CustomEvent<HTMLDivElement>) => void;

    public eventCommand: (e: CustomEvent<IEditorCommand>) => void;

    public get htmlContent(): string {
        try {
            return this.editor?.innerHTML ?? this.initialContent;
        } catch (ex) {
            // tslint:disable-next-line: no-console
            console.warn(ex);
        }
    }

    public set htmlContent(v: string) {
        if (this.editor) {
            this.editor.innerHTML = v;
        } else {
            this.initialContent = v;
        }
        AtomBinder.refreshValue(this, "htmlContent");
    }

    private editorWindow: Window;

    private editorDocument: Document;

    private initialContent: string;

    public insertImage(s: AtomHtmlEditor, e: Event) {
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

    public onPropertyChanged(name) {
        super.onPropertyChanged(name);
        if (name === "tags") {
            this.setupTags();
        }
    }

    protected setupTags() {
        const doc = this.editorDocument;
        if (!doc) {
            return;
        }
        if (Array.isArray(this.tags)) {
            for (const { name, style } of this.tags) {
                if (style) {
                    const styleElement = doc.createElement("style");
                    styleElement.textContent = `*[data-command=${name}] {
                        ${style.toStyleSheet()}
                    }`
                    doc.head.appendChild(styleElement);
                }
            }
        }
    }

    protected preCreate() {
        this.version = 1;
        this.files = [];
        this.runAfterInit(() => {
            this.setup();
        });
        this.element.classList.add(css);
        this.element.classList.add("html-editor");
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
        const baseUrl = `${location.protocol}//${location.host}`;
        doc.writeln(`<base href="${baseUrl}"></base><div id="editor"><p>&nbsp;</p></div>`);
        doc.close();
        const style = doc.createElement("style");
        style.textContent = `body {
            font-family: arial,sans-serif
        }
        #editor {
            min-height: 500px;
        }
        *[data-prompt] {
            background: yellow
        }
        `;
        doc.head.appendChild(style);

        // const script = doc.createElement("script");
        // script.textContent = `document.body.addEventListener("click", ${preventLinkClick.toString()});`;
        // doc.body.appendChild(script);
        doc.body.addEventListener("click", (e) => preventLinkClick(e, this.element, doc));

        this.editor = doc.getElementById("editor") as HTMLDivElement;
        this.editor.contentEditable = "true";
        this.editor.innerHTML = this.initialContent ?? "";
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

        this.bindEvent(this.element, "editorClick", (ce: CustomEvent) => {
            const { detail: { data, target} } = ce;
            if (data.prompt) {
                const element = target as HTMLElement;
                const result = prompt("Enter " + (data.promptTitle ?? data.prompt), data.promptDefault);
                if (result) {
                    const replace = ((data.replace ?? "textContent") as string).split(",").map((x) => x.trim());
                    for (const iterator of replace) {
                        const template = element.getAttribute("data-" + iterator + "-template") || element.getAttribute("data-template");
                        if (template) {
                            element[iterator] = template.replace(data.prompt, result);
                        } else {
                            element[iterator] = result;
                        }
                    }
                }
                return;
            }
            if(this.tags) {
                for (const { name, handler } of this.tags) {
                    if (name === data.command || name === data.clickEvent) {
                        handler(ce);
                    }
                }
            }
        });

        this.setupTags();

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
                <AttachFile/>
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
            <AtomRepeater
                class="files"
                event-item-delete={(ce) => this.files.remove(ce.detail)}
                items={Bind.oneWay(() => this.files)}
                itemRenderer={(file: File) => <div class="file">
                    <i class="ri-attachment-2"/>
                    <label text={file.name}/>
                    <i
                        data-click-event="item-delete"
                        class="ri-close-circle-fill"
                        />
                </div>}
                />
            <iframe class="editor-frame"/>
        </div>);
    }
}
