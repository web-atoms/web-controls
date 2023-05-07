import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

    display: inline-grid;
    grid-auto-flow: column;
    align-content: center;
    justify-items: stretch;
    text-align: center;
    border-style: solid;
    border-width: 1px;
    border-color: #d3d3d3;
    border-radius: 9999px;
        
    & > [data-item-type=toggle-button] {
        padding: 5px;
        background-color: #ffffff;
        cursor: pointer;

        &:first-child {
            padding-left: 10px;
            border-top-left-radius: 9999px;
            border-bottom-left-radius: 9999px;
        }

        &:last-child {
            border-top-right-radius: 9999px;
            border-bottom-right-radius: 9999px;
            padding-right: 10px;
        }

        &[data-selected-item=true] {
            background-color: var(--accent-color, black);
            color: #ffffff;
        }
    }        
    `.installGlobal("[data-button-bar=button-bar]");