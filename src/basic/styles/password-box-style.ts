import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

    display: inline-grid;
    grid-template-columns: 1fr 20px;

    & > input {
        grid-row: 1;
        grid-column: 1 / span 2;

        &::-ms-reveal {
            display: none;
        }
    }

    & > i {
        grid-row: 1;
        grid-column: 1;
        align-self: center;
        justify-self: center;
        z-index: 2;
    }
    `.installGlobal("div[data-password-box=password-box]");