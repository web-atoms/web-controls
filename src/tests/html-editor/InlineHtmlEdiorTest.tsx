import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import AddImage from "../../html-editor/commands/AddImage.js";
import AddLink from "../../html-editor/commands/AddLink.js";
import Align from "../../html-editor/commands/Align.js";
import Bold from "../../html-editor/commands/Bold.js";
import ChangeColor from "../../html-editor/commands/ChangeColor.js";
import ChangeFont from "../../html-editor/commands/ChangeFont.js";
import ChangeFontSize from "../../html-editor/commands/ChangeFontSize.js";
import Headings from "../../html-editor/commands/Headings.js";
import HorizontalRule from "../../html-editor/commands/HorizontalRule.js";
import IndentLess from "../../html-editor/commands/IndentLess.js";
import IndentMore from "../../html-editor/commands/IndentMore.js";
import Italic from "../../html-editor/commands/Italic.js";
import NumberedList from "../../html-editor/commands/NumberedList.js";
import RemoveFormat from "../../html-editor/commands/RemoveFormat.js";
import Separator from "../../html-editor/commands/Separator.js";
import Source from "../../html-editor/commands/Source.js";
import StrikeThrough from "../../html-editor/commands/StrikeThrough.js";
import Underline from "../../html-editor/commands/Underline.js";
import Unlink from "../../html-editor/commands/Unlink.js";
import UnorderedList from "../../html-editor/commands/UnorderedList.js";
import AtomHtmlEditor, { Toolbar } from "../../html-editor/AtomHtmlEditor.js";
import AttachFile from "../../html-editor/commands/AttachFile.js";
import InlineHtmlEditor from "../../html-editor/InlineHtmlEditor.js";
import AttachImage from "../../html-editor/commands/AttachImage.js";

const sample = `
<div>
    <p>Hi <span contenteditable="off" data-prompt="[Name]">[Name]</span></p>
    <p>Link <a
        contenteditable="off"
        data-prompt="[Link]"
        data-replace="textContent,href"
        data-href-template="https://webatoms.in/[Link]">[Link]</a>
    </a>
</div>
`;

@Pack
export default class InlineHtmlEditorTest extends AtomControl {

    protected create(): void {

        const toolbar = () => <div>
            <Toolbar>
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
            </Toolbar>
            <Toolbar>
                <AttachImage/>
                <AttachFile/>
                <Separator/>
                <AddLink/>
                <Unlink/>
                <RemoveFormat/>
                <Separator/>
                <Source/>
            </Toolbar>
        </div>;

        this.render(<div>
            <InlineHtmlEditor
                content={sample}
                toolbar={toolbar}>
            </InlineHtmlEditor>
        </div>);
    }
}
