import type AtomHtmlEditor from "../AtomHtmlEditor";

function query(name: keyof typeof HtmlCommands): IHtmlCommand {
    return {
        canExecute(e: AtomHtmlEditor): boolean {
            return e.queryCommandState(name);
        },
        execute(e: AtomHtmlEditor, showUI?: boolean, value?: string): boolean {
            return e.executeCommand(name, showUI, value);
        }
    };
}

export interface IHtmlCommand {
    canExecute(e: AtomHtmlEditor): boolean;
    execute(e: AtomHtmlEditor, showUI?: boolean, value?: string): boolean;
}

export default class HtmlCommands {

    public static backColor = query("backColor");
    public static bold = query("bold");
    public static contentReadOnly = query("contentReadOnly");
    public static copy = query("copy");
    public static createLink = query("createLink");
    public static cut = query("cut");
    public static decreaseFontSize = query("decreaseFontSize");
    public static defaultParagraphSeparator = query("defaultParagraphSeparator");
    public static enableAbsolutePositionEditor = query("enableAbsolutePositionEditor");
    public static enableInlineTableEditing = query("enableInlineTableEditing");
    public static enableObjectResizing = query("enableObjectResizing");
    public static fontName = query("fontName");
    public static fontSize = query("fontSize");
    public static foreColor = query("foreColor");
    public static formatBlock = query("formatBlock");
    public static forwardDelete = query("forwardDelete");
    public static heading = query("heading");
    public static hiliteColor = query("hiliteColor");
    public static increaseFontSize = query("increaseFontSize");
    public static indent = query("indent");
    public static insertBrOnReturn = query("insertBrOnReturn");
    public static insertHorizontalRule = query("insertHorizontalRule");
    public static insertHTML = query("insertHTML");
    public static insertImage = query("insertImage");
    public static insertOrderedList = query("insertOrderedList");
    public static insertUnorderedList = query("insertUnorderedList");
    public static insertParagraph = query("insertParagraph");
    public static insertText = query("insertText");
    public static italic = query("italic");
    public static justifyCenter = query("justifyCenter");
    public static justifyFull = query("justifyFull");
    public static justifyLeft = query("justifyLeft");
    public static justifyRight = query("justifyRight");
    public static outdent = query("outdent");
    public static paste = query("paste");
    public static redo = query("redo");
    public static removeFormat = query("removeFormat");
    public static selectAll = query("selectAll");
    public static strikeThrough = query("strikeThrough");
    public static subscript = query("subscript");
    public static superscript = query("superscript");
    public static underline = query("underline");
    public static undo = query("undo");
    public static unlink = query("unlink");
    public static useCSS = query("useCSS");
    public static styleWithCSS = query("styleWithCSS");
    public static AutoUrlDetect = query("AutoUrlDetect");

    public static enabled = {
        canExecute(e) {
            return true;
        },
        execute() {
            throw new Error("not supported");
        }
    };

}
