import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import PopupButton from "../../basic/PopupButton";
import type AtomHtmlEditor from "../AtomHtmlEditor";
import styled from "@web-atoms/core/dist/style/styled";

const gray = [
    "rgb(0,0,0)",
    "rgb(68,68,68)",
    "rgb(102,102,102)",
    "rgb(153,153,153)",
    "rgb(204,204,204)",
    "rgb(238,238,238)",
    "rgb(243,243,243)",
    "rgb(255,255,255)"
];

const primary = [
    "rgb(255,0,0)",
    "rgb(255,153,0)",
    "rgb(255,255,0)",
    "rgb(0,255,0)",
    "rgb(0,255,255)",
    "rgb(0,0,255)",
    "rgb(153,0,255)",
    "rgb(255,0,255)"
];

const all = [
    [
        "rgb(244,204,204)",
        "rgb(252,229,205)",
        "rgb(255,242,204)",
        "rgb(217,234,211)",
        "rgb(208,224,227)",
        "rgb(207,226,243)",
        "rgb(217,210,233)",
        "rgb(234,209,220)"
    ],
    [
        "rgb(234,153,153)",
        "rgb(249,203,156)",
        "rgb(255,229,153)",
        "rgb(182,215,168)",
        "rgb(162,196,201)",
        "rgb(159,197,232)",
        "rgb(180,167,214)",
        "rgb(213,166,189)"
    ],
    [
        "rgb(224,102,102)",
        "rgb(246,178,107)",
        "rgb(255,217,102)",
        "rgb(147,196,125)",
        "rgb(118,165,175)",
        "rgb(111,168,220)",
        "rgb(142,124,195)",
        "rgb(194,123,160)"
    ],
    [
        "rgb(204,0,0)",
        "rgb(230,145,56)",
        "rgb(241,194,50)",
        "rgb(106,168,79)",
        "rgb(69,129,142)",
        "rgb(61,133,198)",
        "rgb(103,78,167)",
        "rgb(166,77,121)"
    ],
    [
        "rgb(153,0,0)",
        "rgb(180,95,6)",
        "rgb(191,144,0)",
        "rgb(56,118,29)",
        "rgb(19,79,92)",
        "rgb(11,83,148)",
        "rgb(53,28,117)",
        "rgb(116,27,71)"
    ],
    [
        "rgb(102,0,0)",
        "rgb(120,63,4)",
        "rgb(127,96,0)",
        "rgb(39,78,19)",
        "rgb(12,52,61)",
        "rgb(7,55,99)",
        "rgb(32,18,77)",
        "rgb(76,17,48)"
    ]
];

const colorSelectorCss = styled.css `

    width: 400px;
    display: flex;
    justify-content: space-evenly;

    & > table {
        display: inline-table; 
    }
    
    & .color-button {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-width: 1px;
        margin: 1px;
        cursor: pointer;
        border-style: solid;
        border-color: transparent; 
        &:hover {
            border-color: black; 
        }
    }    
    `.installLocal();

function TextColor(color: string) {
    return <div
        class="color-button"
        eventClick={Bind.event((e: AtomHtmlEditor) => e.executeCommand("foreColor", false, color))}
        styleBackgroundColor={color.toLowerCase()} title={color}></div>;
}

function BackgroundColor(color: string) {
    return <div
        class="color-button"
        eventClick={Bind.event((e: AtomHtmlEditor) => e.executeCommand("hiliteColor", false, color))}
        styleBackgroundColor={color.toLowerCase()} title={color}></div>;
}

export default function ChangeColor() {
    return <PopupButton title="Change Color" class="command" icon="ri-font-color">
        <div class={colorSelectorCss}>
            <table>
                <thead>
                    <tr>
                        <th colSpan={8}>Text Color</th>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        { ... gray.map(TextColor)}
                    </tr>
                </thead>
                <thead>
                    <tr>
                        { ... primary.map(TextColor)}
                    </tr>
                </thead>
                <tbody>
                    { ... all.map((row) => <tr>
                        { ... row.map(TextColor)}
                    </tr>)}
                </tbody>
            </table>
            <table class="background-color">
                <thead>
                    <tr>
                        <th colSpan={8}>Background Color</th>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        { ... gray.map(BackgroundColor)}
                    </tr>
                </thead>
                <thead>
                    <tr>
                        { ... primary.map(BackgroundColor)}
                    </tr>
                </thead>
                <tbody>
                    { ... all.map((row) => <tr>
                        { ... row.map(BackgroundColor)}
                    </tr>)}
                </tbody>
            </table>
        </div>
    </PopupButton>;
}
