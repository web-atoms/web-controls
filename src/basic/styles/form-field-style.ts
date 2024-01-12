import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto auto;
    grid-template-rows: auto auto auto;

    & > [data-element=label] {
        grid-row: 1;
        grid-column: 1;
    }

    & > [data-element=content] {
        grid-row-start: 2;
        grid-column-start: 1;
        grid-column-end: span 2;
        margin-top: 5px;
        margin-bottom: 5px; }

    &[data-border=true] input {
        border: none;
        outline: none; }

    &[data-border=true] textarea {
        border: none;
        outline: none; }

    &[data-border=true] select {
        border: none; }

    & > i[data-border=border] {
        grid-column-start: 1;
        grid-column-end: span 3;
        grid-row-start: 3;
        align-self: flex-end;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #d3d3d3;
    }

    &[data-focused=true] > i[data-border=border] {
        border-bottom-color: #000000;
    }

    & > i[data-help=help] {
        grid-row-start: 2;
        grid-column-start: 3;
        padding: 5px;
        font-size: x-large;
        cursor: pointer;
        margin-left: auto;
        color: #90ee90;
    }

    & > .field-error {
        grid-row-start: 4;
        grid-column-start: 1;
        grid-column-end: span 3;
        padding: 5px;
        margin: 5px;
        border-radius: 9999px;
        background-color: #ff0000;
        color: #ffffff;
        font-size: smaller;
    }

    & > .field-error:empty {
        display: none;
    }

    & > span[data-required=required] {
        grid-column-start: 2;
        grid-row: 1;
        visibility: hidden;
        color: #ff0000;
        
        &.true {
            visibility: visible;
        }
    }

    &[data-layout=horizontal] {

        grid-template-columns: auto auto 1fr auto;
        grid-template-rows: auto auto;

        & > label.label {
            grid-row-start: 2;
            margin-right: 5px;
            margin-bottom: 5px;
        }

        & > [data-content=content] {
            grid-row-start: 2;
            grid-column-start: 3;
            margin-top: 0px;
            margin-bottom: 5px;
        }

        & > i[data-help=help] {
            grid-row-start: 2;
            grid-column-start: 4;
        }

        & > .field-error {
            grid-row-start: 4;
            grid-column-start: 1;
            grid-column-end: span 3;
        }

        & > span[data-required=required] {
            grid-row-start: 2;
            grid-column-start: 2;
            margin-right: 5px;
            display: none;
            color: #ff0000;

            &.true {
                display: inline;
            }
        }
    }

`.installGlobal("[data-wa-form-field=wa-form-field]");

    styled.css `
        overflow: auto;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
    `.installGlobal("[data-form-field-help=help-window]");
