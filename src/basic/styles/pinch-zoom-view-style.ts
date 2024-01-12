import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
        position: relative;
        overflow: hidden;
        cursor: grab;

        &[data-state=grabbing] {
            cursor: grabbing;
        }

        & > .scale {
            position: absolute;
            right: 10px;
            top: 10px;
            border: solid 2px darkgray;
            border-radius: 4px;
            background-color: white;
            padding: 4px;
            color: black;
        }

        & > .image-container {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            display: grid;
            align-items: center;
            justify-items: center;
            justify-content: center;
        }

        & > .spinner {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            display: inline-grid;
            align-items: center;
            justify-items: center;
        }

        & > .hide {
            display: none;
        }
    `.installGlobal("div[data-pinch-zoom]");