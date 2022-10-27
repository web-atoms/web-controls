import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import IElement from "./IElement";

export interface IChip extends IElement {
    icon?: string;
    header?: string;
    label?: string;
    deleteIcon?: string;
    draggable?: boolean;
    recreate?: boolean;
    deleted?: boolean;
}

CSS(StyleRule()
    .padding(1)
    .paddingLeft(5)
    .paddingRight(5)
    .borderRadius(10)
    .display("grid")
    .alignItems("center")
    .gridTemplateRows("auto 1fr")
    .gridTemplateColumns("auto 1fr auto")
    .child(StyleRule("[data-content]")
        .gridRowStart("2")
        .gridColumnStart("2")
    )
    .child(StyleRule(".icon")
        .gridColumnStart("1")
        .gridRowStart("1")
        .gridRowEnd("span 2")
        .padding(2)
        .paddingRight(4)
        .alignSelf("center")
    )
    .child(StyleRule(".delete")
        .gridColumnStart("3")
        .gridRowStart("1")
        .gridRowEnd("span 2")
        .alignSelf("center")
        .fontSize("small")
        .backgroundColor(Colors.transparent)
        .borderRadius(4)
        .padding(2)
        .paddingLeft(4)
        .color(Colors.gray)
        .hover(StyleRule()
            .backgroundColor(Colors.lightGray)
            .color(Colors.red)
        )
    )
    .child(StyleRule(".header")
        .fontSize("x-small")
        .gridRowStart("1")
        .gridColumnStart("2")
    )
    .child(StyleRule(".label")
        .gridRowStart("2")
        .gridColumnStart("2")
    )
    .and(StyleRule("[data-deleted=true]")
        .display("none")
    )
, "*[data-item-chip]");

export default function Chip(
    {
        icon,
        label,
        header,
        deleteIcon = "fa-solid fa-xmark",
        draggable,
        recreate = true,
        deleted,
    }: IChip,
    ... nodes: XNode[]) {
    return <div
        data-recreate={recreate}
        data-deleted={!!deleted}
        data-item-chip="chip"
        draggable={draggable}>
        { icon && <i class={"icon " + icon}/>}
        { header && <label class="header" text={header}/>}
        { label && <label class="label" text={label}/>}
        { ... nodes }
        { deleteIcon && <i class={"delete " + deleteIcon} data-click-event="remove-chip"/> }
    </div>;
}
