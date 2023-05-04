import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

        display: grid;
        grid-template-rows: auto 1fr;
        grid-template-columns: auto 1fr auto;
        align-items: center;

    & > [data-element=icon] {
        grid-column-start: 1;
        grid-row-start: 1;
        padding: 5px;
        margin-right: 5px;
        align-self: center;
        justify-self: center; }

    & > [data-element=header] {
        grid-row-start: 1;
        grid-column-start: 2; }

    & > [data-element=caret] {
        grid-row-start: 1;
        grid-column-start: 3;
        padding: 5px;
        margin-left: 5px; }

    & > [data-element=detail] {
        grid-row-start: 2;
        grid-column-start: 1;
        grid-column-end: span 3;
        margin-top: 5px; }

    &[data-is-expanded=true] {
        & > [data-element=caret] {
            overflow: hidden;
            transform: rotate(-180deg);
            transition: transform 150ms ease;
            transform-origin: center center;
        }
    }

    &[data-is-expanded=false] {
        & > [data-element=caret] {
            overflow: hidden;
            transform: rotate(-360deg);
            transform-origin: center center;
            transition: transform 150ms ease;
        }
        & > *[data-element=detail] {
            display: none;
        }
    }
    `.installGlobal("*[data-is-expander=expander]");

    styled.css `

    display: grid;
    grid-template-columns: auto auto 1fr auto;
    align-items: center;
    gap: 0px;

    & > [data-element=icon] {
        grid-column-start: 1;
        grid-column-end: span 2;
        grid-row-start: 1;
        padding: 5px;
        align-self: center;
        justify-self: center;
    }

    & > [data-element=header] {
        grid-row-start: 1;
        grid-column-start: 3;
    }

    & > [data-element=caret] {
        grid-row-start: 1;
        grid-column-start: 4;
        padding: 5px;
        margin-left: 5px;
    }

    & > [data-element=detail] {
        grid-row-start: 2;
        grid-column-start: 2;
        grid-column-end: span 3;
        padding-left: 20px;
        padding-top: 5px;
        border-left-style: solid;
        border-left-width: 1px;
        border-left-color: var(--border-color, lightgray);
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        border-bottom-width: 0px;
        border-top-width: 0px;
        margin-top: 0px;
        margin-bottom: 0px;

        &[data-selected=true] {
            font-weight: bold;
            border-left-color: var(--accent-color, darkgray);
            border-left-width: medium;
        }
    }

    &[data-is-expanded=true] {
        & > [data-element=caret] {
            overflow: hidden;
            transform: rotate(-180deg);
            transition: transform 150ms ease;
            transform-origin: center center;
        }
    }

    &[data-is-expanded=false] {
        & > [data-element=caret] {
            overflow: hidden;
            transform: rotate(-360deg);
            transform-origin: center center;
            transition: transform 150ms ease;    
        }
        & > *[data-element=detail] {
            display: none;    
        }
    }

    `.installGlobal("*[data-is-expander=menu]")