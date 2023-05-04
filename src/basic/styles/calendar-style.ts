import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

    & {
        display: inline-grid;
        grid-template-rows: auto auto auto;
        grid-template-columns: auto auto auto auto;
    }

    & > .fa-solid {
        padding: 5px;
        padding-left: 10px;
        padding-right: 10px;
        cursor: pointer;
    }

    & > .fa-solid:hover {
        color: blueviolet;
    }
    & > select {
        border: none;
    }

    & > .week {
        grid-column-start: 1;
        grid-column-end: span 4;
        grid-row-start: 2;
        display: inline-grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        gap: 0px;

        & > * {
            font-size: smaller;
            padding: 5;
            padding-left: 10;
            padding-right: 10;
            cursor: default;
            align-self: center;
            justify-self: center;
        }
    }

    & > .dates {
        grid-column-start: 1;
        grid-column-end: span 4;
        grid-row-start: 3;
        display: inline-grid;
        gap: 0px;

        & > [data-item-index] {
            align-self: stretch;
            justify-self: stretch;
            padding: 7px;
            cursor: pointer;
            text-align: center; 

            &:hover {
                background-color: rgba(211,211,211,0.5);             
            }

            &[data-is-today=true] {
                background-color: lightgreen; 
            }

            &[data-is-weekend=true] {
                background-color: rgba(211,211,211,0.3);
            }

            &[data-is-other-month=true] {
                opacity: 0.5;
            }
            &[data-is-disabled] {
                text-decoration: line-through;            
            }
            &[data-selected-item=true] {
                background-color: blueviolet;
                color: white;
            }
        }
    }
    `.installGlobal("*[data-calendar=calendar]");