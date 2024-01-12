import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    margin: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    gap: 4px;
    overflow: hidden;
    & > .header {
        color: darkorange;
        white-space: nowrap;
    }
    & > .items {
        flex: 1 1 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 0;
        overflow: hidden;
        & > * {
            white-space: nowrap;
            padding: 3px;
            cursor: pointer;
            &:hover {
                color: blue;
                text-decoration: underline;
            }
        }
    }
    & > .more {
        font-size: smaller;
        color: blue;
        text-transform: lowercase;
        text-decoration: underline;
        cursor: pointer;
    }
    `.installGlobal("*[data-suggestions=suggestions]");