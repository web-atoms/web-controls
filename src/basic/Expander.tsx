import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

import "./styles/expander-style";

export interface IExpander {
    icon?: string | string[];
    isExpanded: boolean;
    "event-expanded"?: (e: CustomEvent) => any;
    "event-collapsed"?: (e: CustomEvent) => any;
    [key: string]: any;
}

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
    if (!start) {
        return;
    }
    const isExpander = start.dataset?.isExpander;
    if (!/^(menu|expander)$/i.test(isExpander)) {
        return;
    }

    const ds = start.dataset;
    if (/menu/i.test(isExpander)) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    if (ds.isExpanded === "false") {
        start.dispatchEvent(new CustomEvent("expanded", { bubbles: true, cancelable: true }));
    } else {
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