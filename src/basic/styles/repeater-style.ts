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

*[data-selected-item=true] {
    & i[data-click-event=item-select] {
        padding: 5px;
    }
    & i[data-click-event=item-select] {
        display: none;
    }
}

*[data-selected-item=false] {
    & i[data-click-event=item-deselect] {
        display: none;
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