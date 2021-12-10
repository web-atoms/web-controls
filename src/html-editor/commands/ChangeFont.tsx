import Bind from "@web-atoms/core/dist/core/Bind";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import PopupButton from "../../basic/PopupButton";
import type { HtmlEditorControl } from "../HtmlEditor";

const fontMenuCSS = CSS(StyleRule()
    .padding(5)
    .child(StyleRule(".menu")
        .padding(5)
        .hoverBackgroundColor(Colors.lightGreen)
        .child(StyleRule("i")
            .opacity("0")
            .and(StyleRule(".selected")
                .opacity("1")
            )
        )
    )
);

const fonts = [
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
        eventClick={Bind.event((e: HtmlEditorControl) => e.executeCommand("fontName", false, cssName) )}>
        <i class={Bind.oneWay((e: HtmlEditorControl) => ({
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
        text={Bind.oneWay((e: HtmlEditorControl) => selectFont(e.getStyle("fontFamily", e.version)))}
        title="Change Font">
        <div class={fontMenuCSS}>
            { ... fonts.map((x) => <FontMenu name={x[0]} value={x[1]}/>)}
        </div>
    </PopupButton>;
}
