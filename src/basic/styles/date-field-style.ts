import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

    display: inline-flex;
    cursor: pointer;
    text-align: left;
    border: none;
    background-color: transparent;

    &::after {
        content: "";
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url("data:image/svg+xml,<svg height='10px' width='10px' viewBox='0 0 16 16' fill='%23000000' xmlns='http://www.w3.org/2000/svg'><path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/></svg>") no-repeat;
        background-position: 0 center !important;
    }
    
    &:hover {
        text-decoration: underline;
        color: #0000ff;
    }

    & .calendar-popup {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr auto auto;
        gap: 7px;
        min-width: max-content;
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
    `.withOrder("medium").installGlobal("*[data-date-field=date-field]");