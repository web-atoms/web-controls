import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

export interface IExpander {
    icon?: string | string[];
    isExpanded: boolean;
    "event-expanded"?: (e: CustomEvent) => any;
    "event-collapsed"?: (e: CustomEvent) => any;
    [key: string]: any;
}

CSS(StyleRule()
    .display("grid")
    .gridTemplateRows("auto 1fr")
    .gridTemplateColumns("auto 1fr auto")
    .alignItems("center")
    .child(StyleRule("[data-element=icon]")
        .gridColumnStart("1")
        .gridRowStart("1")
        .padding(5)
        .marginRight(5)
        .alignSelf("center")
        .justifySelf("center")
    )
    .child(StyleRule("[data-element=header]")
        .gridRowStart("1")
        .gridColumnStart("2")
    )
    .child(StyleRule("[data-element=caret]")
        .gridRowStart("1")
        .gridColumnStart("3")
        .padding(5)
        .marginLeft(5)
    )
    .child(StyleRule("[data-element=detail]")
        .gridRowStart("2")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .marginTop(5)
    )
    .and(StyleRule("[data-is-expanded=true]")
        .child(StyleRule("[data-element=caret]")
            .overflow("hidden")
            .transform("rotate(-180deg)" as any)
            .transition("transform 150ms ease")
            .transformOrigin("center center")
        )
    )
    .and(StyleRule("[data-is-expanded=false]")
        .child(StyleRule("[data-element=caret]")
            .overflow("hidden")
            .transform("rotate(-360deg)" as any)
            .transformOrigin("center center")
            .transition("transform 150ms ease")
        )
        .child(StyleRule("*[data-element=detail]")
            .display("none")
        )
    )
, "*[data-is-expander=expander]");

document.body.addEventListener("click", (e: MouseEvent) => {
    if (e.defaultPrevented) {
        return;
    }
    let start = e.target as HTMLElement;
    while (start) {
        if (/icon|caret|header/.test(start.dataset.element)) {
            break;
        }
        start = start.parentElement;
    }
    start = start?.parentElement;
    if (!/^(menu|expander)$/i.test(start?.dataset?.isExpander)) {
        return;
    }
    const ds = start.dataset;
    if (ds.isExpanded === "false") {
        // ds.isExpanded = "true";
        e.preventDefault();
        e.stopImmediatePropagation();
        start.dispatchEvent(new CustomEvent("expanded", { bubbles: true, cancelable: true }));
    } else {
        // ds.isExpanded = "false";
        e.preventDefault();
        e.stopImmediatePropagation();
        start.dispatchEvent(new CustomEvent("collapsed", { bubbles: true, cancelable: true }));
    }
}, { capture: true });

document.body.addEventListener("expanded", (ce) => {
    if (ce.defaultPrevented) {
        return;
    }
    const target = ce.target as HTMLElement;
    target.dataset.isExpanded = "true";
});

document.body.addEventListener("collapsed", (ce) => {
    if (ce.defaultPrevented) {
        return;
    }
    const target = ce.target as HTMLElement;
    target.dataset.isExpanded = "false";
});

export default function Expander(
    {
        icon,
        isExpanded,
        ... a
    }: IExpander,
    header: XNode, detail: XNode) {
    if (!detail) {
        throw new Error("Expander must contain two children, one header and one detail")
    }
    const ha = header.attributes ??= {};
    const da = detail.attributes ??= {};
    ha["data-element"] = "header";
    da["data-element"] = "detail";
    const iconElement = !icon
        ? []
        : ( Array.isArray(icon)
            ? icon
            : [icon] ).map((i) => <i data-element="icon" class={i}/>);
    return <div
        data-is-expander = "expander"
        data-is-expanded={isExpanded}
        {... a}>
        { ... iconElement }
        { header }
        { <i data-element="caret" class="fas fa-angle-down"/>}
        { detail }
    </div>;
}

CSS(StyleRule()
    .display("grid")
    .gridTemplateColumns("auto auto 1fr auto")
    .alignItems("center")
    .gap(0)
    .child(StyleRule("[data-element=icon]")
        .gridColumnStart("1")
        .gridColumnEnd("span 2")
        .gridRowStart("1")
        .padding(5)
        .alignSelf("center")
        .justifySelf("center")
    )
    .child(StyleRule("[data-element=header]")
        .gridRowStart("1")
        .gridColumnStart("3")
    )
    .child(StyleRule("[data-element=caret]")
        .gridRowStart("1")
        .gridColumnStart("4")
        .padding(5)
        .marginLeft(5)
    )
    .child(StyleRule("[data-element=detail]")
        .gridRowStart("2")
        .gridColumnStart("2")
        .gridColumnEnd("span 3")
        .paddingLeft(20)
        .paddingTop(5)
        .borderLeftStyle("solid")
        .borderLeftWidth(1)
        .borderLeftColor("var(--border-color, lightgray)")
        .borderTopLeftRadius(0)
        .borderBottomLeftRadius(0)
        .borderBottomWidth(0)
        .borderTopWidth(0)
        .marginTop(0)
        .marginBottom(0)
        .and(StyleRule("[data-selected=true]")
            .fontWeight("bold")
            .borderLeftColor("var(--accent-color, darkgray)")
            .borderLeftWidth("medium")
        )
    )
    .and(StyleRule("[data-is-expanded=true]")
        .child(StyleRule("[data-element=caret]")
            .overflow("hidden")
            .transform("rotate(-180deg)" as any)
            .transition("transform 150ms ease")
            .transformOrigin("center center")
        )
    )
    .and(StyleRule("[data-is-expanded=false]")
        .child(StyleRule("[data-element=caret]")
            .overflow("hidden")
            .transform("rotate(-360deg)" as any)
            .transformOrigin("center center")
            .transition("transform 150ms ease")
        )
        .child(StyleRule("*[data-element=detail]")
            .display("none")
        )
    )
, "*[data-is-expander=menu]");

export function ExpanderMenu({
        icon,
        isExpanded,
        ... a
    }: IExpander,
    header: XNode, ... details: XNode[]) {
    if (details.length === 0) {
        throw new Error("Expander must contain two children, one header and one detail")
    }
    const ha = header.attributes ??= {};
    ha["data-element"] = "header";
    let i = 2;
    for (const iterator of details) {
        const ia = (iterator.attributes ??= {});
        ia["data-element"] = "detail";
        ia["style-grid-row-start"] = (i++).toString();
    }
    const iconElement = !icon
        ? []
        : ( Array.isArray(icon)
            ? icon
            : [icon] ).map((i) => <i data-element="icon" class={i}/>);
    return <div
        data-is-expander = "menu"
        data-is-expanded={isExpanded}
        {... a}>
        { ... iconElement }
        { header }
        { <i data-element="caret" class="fas fa-angle-down"/>}
        { ... details }
    </div>;
}