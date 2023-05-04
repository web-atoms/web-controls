import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

    display: inline-block;
    cursor: pointer;
    text-align: left;
    
    &:hover {
        text-decoration: underline;
        color: #0000ff;
    }

    & .calendar-popup {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr auto auto;
        gap: 7px;
    }

    & .calendar-popup > [data-calendar] {
        grid-row: 1;
        grid-column: 1 / span 2;
    }

    & .calendar-popup > .time-editor {
        padding-left: 5px;
        grid-row: 2;
        flex-direction: row;
        align-items: center;
        justify-content: start;
        gap: 4px;
        display: flex;
    }

    & .calendar-popup > .time-editor [data-item-index] {
        padding-top: 0px;
        padding-bottom: 0px;
    }

    & .calendar-popup > .time-editor select {
        border: none;
        outline: none;
    }

    & .calendar-popup > .clear {
        grid-column: 1;
        grid-row: 3;
        justify-self: start;
        border: none;
        outline: none;
        background-color: transparent;
        color: var(--accent-color, blue);
        padding-left: 5px;
        margin-left: 0px;
    }

    & .calendar-popup > .today {
        grid-row: 3;
        grid-column: 2;
        justify-self: end;
        border: none;
        outline: none;
        background-color: transparent;
        color: var(--accent-color, blue);
        padding-left: 5px;
        margin-left: 0px;
    }
    `.installGlobal("*[data-date-field=date-field]");