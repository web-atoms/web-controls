import styled from "@web-atoms/core/dist/style/styled";

export const repeaterPopupCss = styled.css `
    min-width: 200px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;

    & > .items {
        flex: 1 1 100%;
        overflow: auto;
        & > .presenter {
            & > * {
                padding: 5px;
            }
            & > [data-item-index] {
                cursor: pointer;
                &:hover {
                    color: blue;
                    text-decoration: underline;
                }
            }
            & > [data-selected-item=true] {
                background-color: lightgreen;
            }
        }
    }
`.installLocal();