import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
        display: inline-block;
        & > label {
            display: flex;
            padding-left: 5px;
            padding-right: 5px;
            & > input[type=checkbox] {
                border-radius: 3px;
                margin: 0;
                padding: 0;
                align-self: center;
            }
            & > span {
                align-self: center;
                white-space: nowrap;
                margin-left: 5px;
                flex: 1 1 100%;
            }
        }    
    `.installGlobal("[data-check-box=check-box]");