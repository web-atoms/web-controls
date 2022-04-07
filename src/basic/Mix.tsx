import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import IElement from "./IElement";

CSS(StyleRule()
    .display("inline-grid")
    .and(StyleRule("[data-block=true]")
        .display("grid")
    )
, "*[data-mix=mix]");

export interface IMix extends IElement {
    block?: boolean;
}

export default function Mix({
    block = false ,
    ... a}, ... nodes: XNode[]) {
    return <div
        data-block={!!block}
        data-mix="mix" { ... a}>
            { ... nodes }
        </div>;
}