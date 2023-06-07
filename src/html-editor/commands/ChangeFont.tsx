import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import PopupButton, { MenuItem } from "../../basic/PopupButton";
import type AtomHtmlEditor from "../AtomHtmlEditor";
import styled from "@web-atoms/core/dist/style/styled";

const fontMenuCSS = styled.css `
    padding: 5px;
    width: 170px;
`.installLocal();

const fonts: Array<[string, string[]]> = [
    ["Sans Serif", ["arial", "sans-serif"]],
    ["Serif", [`"times new roman"`, "serif"]],
    ["Fixed Width", ["monospace"]],
    ["Wide", [`"arial black"`, "sans-serif"]],
    ["Narrow", [`"arial narrow"`, "sans-serif"]],
    ["Comic Sans MS", [`"comic sans ms"`, "sans-serif"]],
    ["Garamond", ["garamond", `"times new roman"`, "serif"]],
    ["Georgia", ["georgia"]],
    ["Tahoma", ["tahoma"]],
    ["Trebuchet MS", [`"trebuchet ms"`]],
    ["Verdana", ["verdana"]]
];

export function FontMenu({ name, value }) {
    const cssName = value.join(" ");
    return <div
        class="menu"
        eventClick={Bind.event((e: AtomHtmlEditor) => e.executeCommand("fontName", false, cssName) )}>
        <i class={Bind.oneWay((e: AtomHtmlEditor) => ({
                "ri-check-line": 1,
                "selected": e.getStyle("fontFamily", e.version)
                    .toLowerCase()
                    .indexOf(value[0].toLowerCase()) !== -1
            }))}/>
        <label styleFontFamily={name}>{name}</label>
    </div>;
}

function selectFont(name: string) {
    if (name === null || name === void 0) {
        return "Font";
    }
    for (const [display, value] of fonts) {
        for (const iterator of value) {
            if (name.indexOf(iterator) !== -1) {
                return display;
            }
        }
    }
    return "Font";
}

export default function ChangeFont() {
    return <PopupButton
        class="command"
        data-layout="toolbar-button"
        text={Bind.oneWay((e: AtomHtmlEditor) => selectFont(e.getStyle("fontFamily", e.version)))}
        title="Change Font">
        <div class={fontMenuCSS}>
            { ... fonts.map(([name, value]) =>
                <MenuItem
                    style-font-family={name}
                    icon={Bind.oneWay((e: AtomHtmlEditor) => selectFont(e.getStyle("fontFamily", e.version))
                    .toLowerCase()
                    .indexOf(value[0].toLowerCase()) !== -1
                    ? "ri-check-line selected"
                    : "")}
                    label={name}
                    eventClick={Bind.event((e: AtomHtmlEditor) =>
                        e.executeCommand("fontName", false, value.join(" ")) )}
                    />)}
        </div>
    </PopupButton>;
}
