import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    & > thead {
        & > tr[data-header=header] {
            & > th {
                & > i[data-sort] {
                    margin-right: 5px;
                    margin-left: 3px;
                    opacity: 0.5;
                }
                & > input[type=checkbox] {
                    margin: 5px;
                }
            }
        }
    }

    & > tbody {
        & > tr[data-item-index] {
            &:hover {
                background-color: rgba(135,206,250,0.3);
            }
            &[data-selected-item=true] {
                background-color: rgba(211,211,211,0.4);
            }
            & > td[data-ellipsis] {
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
    `.installGlobal("table[data-data-grid=data-grid]");