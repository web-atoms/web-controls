import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

    & > *[data-item-index] {
        padding: 5px;
        border-radius: 5px;
        background-color: var(--list-bg-color);
        color: var(--list-color);

        &:hover {
            background-color: var(--list-selected-bg-color-hover, lightgreen);
            color: var(--list-selected-color-hover, inherit);
        }

        & > td {
            padding : 5px;
        }

        &[data-selected-item=true] {
            background-color: var(--list-selected-bg-color, lightgray);
            color: var(--list-selected-color, inherit);
        }
    }
    `.installGlobal("*[data-list-repeater=list-repeater]");