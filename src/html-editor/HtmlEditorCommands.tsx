import { IRangeUpdate } from "./RangeEditor";

export interface IHtmlEditorCommand {
    [key: string]: (e: IRangeUpdate) => void;
}


const HtmlEditorCommands = {

    bold({ range, check, update}) {

    }

} as IHtmlEditorCommand;

export default HtmlEditorCommands;
