import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    position: absolute;
    border-radius: 5px;
    padding: 5px;
    box-shadow: rgba(50, 50, 105, 0.5) 0px 4px 6px 4px, rgba(0, 0, 0, 0.5) 0px 1px 1px 0px;
    border: solid 1px rgba(0, 0, 0, 0.05);
    z-index: 5000;
    background-color: var(--popup-background-color, white);
    color: var(--popup-text-color, rgba(0,0,0,0.8));
    left: 0;
    `.installGlobal("*[data-inline-popup=inline-popup]");

    styled.css `
    right: 0;
    left: unset;
    `.installGlobal("*[data-alignment=bottom-right] > [data-inline-popup=inline-popup]");


    // styled.css `
    //     flex-direction: row;
    //     align-items: center;
    //     justify-content: center;
    //     gap: 4px;
    //     display: inline-flex;
    //     flex-wrap: wrap;
    //     padding: 3px;
    //     padding-left: 5px;
    //     padding-right: 5px;

    //     &[data-has-border=false] {
    //         border: none;
    //         background-color: transparent;
    //     }
    // `.installGlobal("*[data-inline-popup-button=inline-popup-button]");