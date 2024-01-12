import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
        display: inline;
        position: relative;
        padding-left: 2px;
        padding-top: 2px;
        font-family: monospace;

        &::before {
            position: absolute;
            left: 2px;
            top: 2px;
            content: attr(data-label);
            font-family: inherit;
            font-weight: inherit;
            font-size: inherit;
            pointer-events: none;
        }

        &::after {
            position: absolute;
            left: 2px;
            top: 2px;
            content: attr(data-mask);
            font-family: inherit;
            font-weight: inherit;
            font-size: inherit;
            pointer-events: none;
            opacity: 0.2;
        }

        * > input {
            color: transparent;
            caret-color: gray;
            font-family: inherit;
            font-weight: inherit;
            font-size: inherit;
        }

    `.installGlobal();