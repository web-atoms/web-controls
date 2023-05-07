import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    gap: 4px;
    flex-wrap: wrap;
    `.installGlobal("*[data-radio-button-list=radio-button-list]");

    styled.css `
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    margin-right: 5px;

    & > span {
        cursor: pointer;
    }

    &[data-selected-item=true] {
        & > i.fa-circle {
            display: none;
        }
    }
    &[data-selected-item=false] {
        & > i.fa-dot-circle {
            display: none;
        }
    }
    `.installGlobal("div[data-item-type=radio]");