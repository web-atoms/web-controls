import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
        display: grid;
        & > * {
            grid-row: 1;
            grid-column: 1;
        }
    `.installGlobal("[data-swipe]");

    styled.css `
        & > * {
            align-self: center;
            justify-self: end;
            z-index: 2;
            &:first-child {
                align-self: stretch;
                justify-self: stretch;
                z-index: 10;
            }
        }
    `.installGlobal("[data-swipe=left]");