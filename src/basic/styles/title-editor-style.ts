import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    display: inline-grid;
    grid-template-rows: 1fr auto;
    grid-template-columns: 1fr 40px;
    column-gap: 5px;

    & > input {
        grid-row: 1 / span 2;
        grid-column: 1;
    }

    & > i {
        grid-row: 1;
        grid-column: 1;
        font-size: smaller;
        padding-left: 5px;
        padding-right: 5px;
        align-self: stretch;
        justify-self: stretch;
        text-align: center;
    }

    & > span {
        grid-row: 2;
        grid-column: 2;
        font-size: xx-small;
        align-self: stretch;
        justify-self: stretch;
        text-align: center;
    }

    `.installGlobal("[data-title-editor=title-editor]");