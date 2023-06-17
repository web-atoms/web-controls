import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
        padding: 2px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 9999px;
        display: grid;
        align-items: center;
        grid-template-rows: auto 1fr;
        grid-template-columns: auto 1fr auto;

        & > [data-content] {
            grid-row-start: 2;
            grid-column-start: 2;
        }

        & > .icon {
            grid-column-start: 1;
            grid-row-start: 1;
            grid-row-end: span 2;
            padding: 2px;
            padding-right: 4px;
            align-self: center;
        }

        & > .delete {
            grid-column-start: 3;
            grid-row-start: 1;
            grid-row-end: span 2;
            align-self: center;
            font-size: small;
            background-color: transparent;
            border-radius: 4px;
            padding: 2px;
            padding-left: 4px;
            color: gray;
            &:hover {
                background-color: lightgray;
                color: red; 
            }
        }

        & > .header {
            font-size: x-small;
            grid-row-start: 1;
            grid-column-start: 2;
            text-align: center;
        }

        & > .label {
            grid-row-start: 2;
            grid-column-start: 2;
        }

        & > .delete-strike {
            grid-row: 1 / span 2;
            grid-column: 1 / span 2;
            height: 2px;
            background-color: red;
            align-self: center;
        }

        &[data-deleted=false] {
            & > .delete-strike {
                display: none;
            }
        }

        &[data-deleted=true] {
            border: solid 1px red;
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' preserveAspectRatio='none' viewBox='0 0 100 100'><path d='M100 0 L0 100 ' stroke='red' stroke-width='1'/><path d='M0 0 L100 100 ' stroke='red' stroke-width='1'/></svg>"); 
        }
`.installGlobal("*[data-item-chip]");