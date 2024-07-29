import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
        padding: 1px;
        padding-left: 5px;
        padding-right: 5px;
        border-radius: 10px;
        display: grid;
        align-items: center;
        grid-template-rows: auto 1fr;
        grid-template-columns: auto 1fr auto;

        max-width: 100%;

        overflow-x: hidden;
        
        & > [data-content] {
            grid-row-start: 2;
            grid-column-start: 2;
        }
        & > .icon {
            grid-column-start: 1;
            grid-row-start: 1;
            grid-row-end: span 2;
            align-self: center;
            margin-right: 5px;
        }
        & > .delete {
            grid-column-start: 3;
            grid-row-start: 1;
            grid-row-end: span 2;
            align-self: center;
            color: #ff0000;
        }
        & > .header {
            font-size: x-small;
            grid-row-start: 1;
            grid-column-start: 2;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        & > .label {
            grid-row-start: 2;
            grid-column-start: 2;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `.installGlobal("*[data-item-suggestion]");