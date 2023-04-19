import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AddImage from "../../html-editor/commands/AddImage";
import AddLink from "../../html-editor/commands/AddLink";
import Align from "../../html-editor/commands/Align";
import Bold from "../../html-editor/commands/Bold";
import ChangeColor from "../../html-editor/commands/ChangeColor";
import ChangeFont from "../../html-editor/commands/ChangeFont";
import ChangeFontSize from "../../html-editor/commands/ChangeFontSize";
import Headings from "../../html-editor/commands/Headings";
import HorizontalRule from "../../html-editor/commands/HorizontalRule";
import IndentLess from "../../html-editor/commands/IndentLess";
import IndentMore from "../../html-editor/commands/IndentMore";
import Italic from "../../html-editor/commands/Italic";
import NumberedList from "../../html-editor/commands/NumberedList";
import RemoveFormat from "../../html-editor/commands/RemoveFormat";
import Separator from "../../html-editor/commands/Separator";
import Source from "../../html-editor/commands/Source";
import StrikeThrough from "../../html-editor/commands/StrikeThrough";
import Underline from "../../html-editor/commands/Underline";
import Unlink from "../../html-editor/commands/Unlink";
import UnorderedList from "../../html-editor/commands/UnorderedList";
import AtomHtmlEditor, { Toolbar } from "../../html-editor/AtomHtmlEditor";
import AttachFile from "../../html-editor/commands/AttachFile";
import InlineHtmlEditor from "../../html-editor/InlineHtmlEditor";
import AttachImage from "../../html-editor/commands/AttachImage";

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
