import styled from "@web-atoms/core/dist/style/styled";


    styled.css `

        display: inline-flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        flex-flow: wrap;

    `.installGlobal("div[data-checkbox-list=checkbox-list]");

    styled.css `

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;

        margin-right: 5px;

        & > span {
            cursor: pointer;
        }

        &:not([data-selected-item]) {
            &[data-deleted=none] > i.fas {
                display: none;
            }
            &[data-deleted=false] > i.fas {
                display: none;
            }
            &[data-deleted=true] > i.fas {
                display: none;
            }
        }

        &[data-selected-item=true] {
            color: blue;

            &[data-deleted=none] > i.far {
                display: none;
            }
            &[data-deleted=true] > i.fas {
                display: none;
            }
            &[data-deleted=false] > i.far {
                display: none;
            }
        }

    `.installGlobal("div[data-item-type=checkbox]");

