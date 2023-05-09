import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    flex: 1 1 100%;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-around;
    gap: 4px;
    display: flex;
    overflow: hidden;
        
    & > .toolbar {
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        display: flex;
        align-self: center; 

        & > .item {
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
    
    
    & > .presenter {
        flex: 1 1 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        overflow: hidden; 
        & > * {
            grid-row-start: 1;
            grid-column-start: 1;
            transition: transform 0.3s;
            overflow: auto;
            padding: 5px; 
        }
        & > .left {
            transform: translate(-100%, 0); 
        }
        
        & > .right {
            transform: translate(100%, 0); 
        }
        
        & > .selected {
            transform: translate(0, 0);
        }
    }
    
    `.installGlobal("*[data-wa-toggle-view=wa-toggle-view]");