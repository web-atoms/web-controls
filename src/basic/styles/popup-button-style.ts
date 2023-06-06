import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    flex-wrap: wrap;
    min-width: 20ch;
    &:hover {
        background-color: lightgreen;
    }

    & > * {
        flex-shrink: 0;
    }

    `.installGlobal("*[data-menu-item=menu-item]");

    styled.css `
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    gap: 4px;
    `.installGlobal("*[data-menu-items=menu-items]");