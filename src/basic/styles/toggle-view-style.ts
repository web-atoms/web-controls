import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    flex: 1 1 100%;
    gap: 4px;
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: hidden;
    align-items: stretch;
    justify-items: stretch;
    justify-content: stretch;
        
    & > .toolbar {
        grid-row: 1;
        flex-direction: row;
        display: flex;
        place-self: center;

        & > [data-element=header] {
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            gap: 4px;
            display: inline-flex;
            border: solid 1px lightgray;
            padding: 5px; 

            &:first-child {
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
                border-right: none;
            }
            
            &:last-child {
                border-top-right-radius: 10px;
                border-bottom-right-radius: 10px; 
                border-left: none;
            }
            
            &.selected {
                background-color: var(--accent-color, #00008b);
                color: var(--accent-text-color,#ffffff); 
            }

            & > label {
                white-space: nowrap;
                margin-bottom: 0px; 
            }
        }
        
    }
    
    
    & > [data-element=view] {
        grid-row-start: 2;
        grid-column-start: 1;
        transition: transform 0.3s;
        align-self: stretch;
        justify-self: stretch;
        overflow: auto;
        padding: 5px;
        &[data-left=true] {
            transform: translate(-100%, 0); 
        }
        
        &[data-right=true] {
            transform: translate(100%, 0); 
        }
        
        &[data-selected=true] {
            transform: translate(0, 0);
        }
    }
    
    `.installGlobal("*[data-wa-toggle-view=wa-toggle-view]");