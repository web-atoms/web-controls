
import styled, { svgAsCssDataUrl } from "@web-atoms/core/dist/style/styled";

const svg = svgAsCssDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M502.6 54.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L336 130.7 336 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128c0 17.7 14.3 32 32 32l128 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-50.7 0L502.6 54.6zM80 272c-17.7 0-32 14.3-32 32s14.3 32 32 32l50.7 0L9.4 457.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L176 381.3l0 50.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128c0-17.7-14.3-32-32-32L80 272z"/></svg>`);


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
            width: 30px;
            height: 30px;
            background-image: ${svg};
            background-position: 2px 2px;
            background-size: 20px 20px;
            background-repeat: no-repeat;
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
            z-index: 10;
        }

        & > .hide {
            display: none;
        }
    `.installGlobal("div[data-pinch-zoom]");