import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
        display: inline-flex;
        flex-direction: row;
        gap: 4px;
        align-items: center;
        justify-content: stretch;

        & [data-white-space=nowrap] {
            white-space: nowrap;
        }
    `.installGlobal("div[data-drop-down=drop-down]");