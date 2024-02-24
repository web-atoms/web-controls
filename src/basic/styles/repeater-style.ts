import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

*[data-selected-item] {
    & i[data-click-event] {
        padding: 5px;
    }
    & [data-no-wrap=true] {
        white-space: nowrap;
    }
}

*[data-item-index] {
    & label[data-selector=check-box] {
        padding: 5px;
        width: 30px;
        & > i {
            padding: 0;
        }
    }
    &:not([data-selected-item]) {
        & [data-selector=check-box] {
            & i[data-click-event=item-deselect] {
                display: none;
            }
        }
    }
    &[data-selected-item=true] {
        & [data-selector=check-box] {
            & i[data-click-event=item-select] {
                display: none;
            }
        }
    }
}

*[data-select-all=select-all] {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 0;
    & i[data-ui-type] {
        padding: 5px;
    }
    & [data-no-wrap=true] {
        white-space: nowrap;
    }
    &[data-is-selected=true] {
        & i[data-ui-type=item-select] {
            display: none;
        }
    }
    &[data-is-selected=false] {
        & i[data-ui-type=item-deselect] {
            display: none;
        }
    }
}
`.withId("repeater-styles").installGlobal();