import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

export interface IExpander {
    icon?: string | string[];
    isExpanded: boolean;
    "event-expanded"?: () => void;
    "event-collapsed"?: () => void;
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
, "*[data-is-expander]");

document.body.addEventListener("click", (e: MouseEvent) => {
    let start = e.target as HTMLElement;
    while (start) {
        if(/icon|caret|header/.test(start.dataset.element)) {
            break;
        }
        start = start.parentElement;
    }
    start = start?.parentElement;
    if (!(start?.dataset.isExpander === "is-expander")) {
        return;
    }
    const ds = start.dataset;
    if (ds.isExpanded === "false") {
        ds.isExpanded = "true";
        start.dispatchEvent(new CustomEvent("expanded", { bubbles: false }));
    } else {
        ds.isExpanded = "false";
        start.dispatchEvent(new CustomEvent("collapsed", { bubbles: false }));
    }
});

export default function Expander(
    {
        icon,
        isExpanded,
        ... a
    }: IExpander,
    header: XNode, detail: XNode) {
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
        data-is-expander="is-expander"
        data-is-expanded={isExpanded}
        {... a}>
        { ... iconElement }
        { header }
        { <i data-element="caret" class="fas fa-angle-down"/>}
        { detail }
    </div>;
}