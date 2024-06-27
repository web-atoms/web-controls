import XNode from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        align-content: center;
        justify-content: center;
        gap: var(--spacing, 5px);

        & .command {
            display: flex;
            align-content: center;
            justify-content: center;
            align-items: center;
            justify-items: center;
        }

    `.installGlobal("[data-html-editor-element=toolbar]")

export default function Toolbar(a: any, ... nodes: XNode[]) {
    return <div data-html-editor-element="toolbar" { ... a}>
        { ... nodes}
    </div>;
}