import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import LimitedText from "../../../basic/LimitedText";
import Pack from "@web-atoms/core/dist/Pack";

const p = `Paragraphs are the building blocks of papers. Many students define paragraphs in terms of length: a paragraph is a group of at least five sentences, a paragraph is half a page long, etc. In reality, though, the unity and coherence of ideas among sentences is what constitutes a paragraph. A paragraph is defined as “a group of sentences or a single sentence that forms a unit” (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long. Ultimately, a paragraph is a sentence or group of sentences that support one main idea. In this handout, we will refer to this as the “controlling idea,” because it controls what happens in the rest of the paragraph.`;

@Pack
export default class LimitedTextTest extends AtomControl {

    protected create(): void {
        this.render(<div style="width: 400px; height: 400px; position: relative;">
            <div
                data-layout="vertical-flex-stretch-items"
                style="position: absolute; left: 0; right: 0; bottom: 0; top: 0;">
                <LimitedText
                    text={p}
                    />
            </div>
        </div>);
    }
}
