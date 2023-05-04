import styled from "@web-atoms/core/dist/style/styled";

const hasMoreHeight =  (window.screen.availHeight / 2) > 250
    ? `height: 250px;`
    : `max-height: 80px;`;

    styled.css `
    ${hasMoreHeight}
    min-width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    gap: 4px;

    & > .items {
        flex: 1 1 100%;
        overflow: auto;
        & > .presenter {
            & > * {
                padding: 5px;
            }
            & > [data-selected-item=true] {
                background-color: lightgreen;
            }
        }
    }
    `.installGlobal("*[data-suggestion-popup=suggestion-popup]");