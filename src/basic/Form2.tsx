import XNode from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    display: flex;
    flex-direction: column;
    gap: --var(spacing, 5px);
`
.and("[data-valid=true] .field-error:not(:empty)", styled.css `
    display: none;
`).installGlobal("[data-form=form]");

export default function Form2(a, ... nodes: XNode[]) {
    return <div
        data-form="form"
        data-valid="true"
        event-click={()}>
        
    </div>;
}