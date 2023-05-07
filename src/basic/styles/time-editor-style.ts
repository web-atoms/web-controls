import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

    padding-left: 5px;
    grid-row: 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    gap: 0;

    & > [data-element=hour] {
        margin-left: 5px;
        margin-right: 5px;
    }

    & > [data-element=minute] {
        margin-left: 5px;
    }

    & > [data-element=pm] {
        margin-right: 5px;
    }

    & > button {
        border-radius: 9999px;
        outline: none;
        border: none;
        background-color: transparent;

        &[data-selected=true] {
            background-color: var(--accent-color, blue);
            color: var(--accent-text-color, white);
        }

        &[data-element=am] {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        &[data-element=pm] {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }

    & > select {
        border: none;
        outline: none;
    }

    `.installGlobal("[data-time-editor]");