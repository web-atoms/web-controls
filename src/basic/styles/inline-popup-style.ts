import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    position: absolute;
    border-radius: 5px;
    padding: 5px;
    box-shadow: rgba(50, 50, 105, 0.07) 0px 2px 5px 0px, rgba(0, 0, 0, 0.03) 0px 1px 1px 0px;
    border: solid 1px rgba(0, 0, 0, 0.05);
    z-index: 5000;
    background-color: var(--primary-bg, white);
    color: var(--primary-color, darkgray);
    left: 0;
    `.installGlobal("*[data-inline-popup=inline-popup]");

    styled.css `
    right: 0;
    left: unset;
    `.installGlobal("*[data-alignment=bottom-right] > [data-inline-popup=inline-popup]");
