import Bind from "@web-atoms/core/dist/core/Bind";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import PopupButton, { MenuItem } from "../../basic/PopupButton";
import type AtomHtmlEditor from "../AtomHtmlEditor";

const fontMenuCSS = CSS(StyleRule()
    .padding(5)
    .width(170)
    // .child(StyleRule(".menu")
    //     .padding(5)
    //     .hoverBackgroundColor(Colors.lightGreen)
    //     .child(StyleRule("i")
    //         .opacity("0")
    //         .and(StyleRule(".selected")
    //             .opacity("1")
    //         )
    //     )
    // )
);

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
    if (name === null) {
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
        text={Bind.oneWay((e: AtomHtmlEditor) => selectFont(e.getStyle("fontFamily", e.version)))}
        title="Change Font">
        <div class={fontMenuCSS}>
            { ... fonts.map(([name, value]) =>
                <MenuItem
                    style-font-family={name}
                    icon={Bind.oneWay((e: AtomHtmlEditor) => e.getStyle("fontFamily", e.version)
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
