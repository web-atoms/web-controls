import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

        position: relative;
        display: inline-block;
        vertical-align: top;
        min-width: 70px;
        height: 30px;
        padding: 3px;
        margin: 0px;
        background: linear-gradient(to bottom, #eeeeee, #FFFFFF 25px);
        background-image: -webkit-linear-gradient(top, #eeeeee, #FFFFFF 25px);
        border-radius: 18px;
        box-shadow: inset 0 -1px white, inset 0 1px 1px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        box-sizing: content-box;
    
    & > .switch-input {
        position: absolute;
        top: 0px;
        left: 0px;
        opacity: 0;
        box-sizing: content-box;
    }
        
    & > .switch-label {
        position: relative;
        display: block;
        height: inherit;
        background-color: #eceeef;
        border-radius: inherit;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.15);
        box-sizing: content-box;
        transition: all 0.3s ease;

        &:before, &:after {
            position: absolute;
            top: 50%;
            margin-top: -.5em;
            line-height: 1;
            webkit-transition: inherit;
            transition: inherit;
            box-sizing: content-box;
        }

        &:before {
            content: attr(data-off);
            right: 11px;
            color: #aaaaaa;
            text-shadow: 0 1px rgba(255, 255, 255, 0.5);
        }

        &:after {
            content: attr(data-on);
            left: 11px;
            color: #FFFFFF;
            text-shadow: 0 1px rgba(0, 0, 0, 0.2);
            opacity: 0; 
        }
    }

    & > .switch-input:checked {

        & ~ .switch-label {
            background-color: #E1B42B;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 3px rgba(0, 0, 0, 0.2);
        }
        
        & ~ .switch-label:before {
            opacity: 0;
        }
        
        & ~ .switch-label:after {
            opacity: 1;
        }

        & ~ .switch-handle {
            left: 44px;
            box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2);
        }
    }
        
   
    & > .switch-handle {
        position: absolute;
        top: 4px;
        left: 4px;
        width: 28px;
        height: 28px;
        background: linear-gradient(to bottom, #FFFFFF 40%, #f0f0f0);
        border-radius: 100%;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        &:before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 12px;
            height: 12px;
            background: linear-gradient(to bottom, #eeeeee, #FFFFFF);
            border-radius: 6px;
            box-shadow: inset 0 1px rgba(0, 0, 0, 0.02);
        }
    }
    
    & > .switch-input:checked ~ .switch-handle {
        left: 44px;
        box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2);
    }
    
    & > .switch-label, .switch-handle {
        transition: All 0.3s ease;
    }
    `.installGlobal("[data-ui-switch=ui-switch]");