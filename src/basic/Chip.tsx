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
    undoDeleteIcon?: string;
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
    .child(StyleRule(".delete-strike")
        .gridRow("1 / span 2")
        .gridColumn("1 / span 2")
        .height(2)
        .backgroundColor(Colors.red)
        .alignSelf("center")
    )
    .and(StyleRule("[data-deleted=false] > .delete-strike")
        .display("none")
    ).and(StyleRule("[data-deleted=true]")
        .border("solid 1px red")
        .backgroundImage(`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' preserveAspectRatio='none' viewBox='0 0 100 100'><path d='M100 0 L0 100 ' stroke='red' stroke-width='1'/><path d='M0 0 L100 100 ' stroke='red' stroke-width='1'/></svg>")`)
    )
, "*[data-item-chip]");

export default function Chip(
    {
        icon,
        label,
        header,
        deleteIcon = "fa-solid fa-xmark",
        undoDeleteIcon = "fa-solid fa-undo",
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
        { deleted && <div class="delete-strike"/>}
        { undoDeleteIcon && deleted && <i
            class={"undo delete " + undoDeleteIcon} data-click-event="undo-remove-chip"/> }
        { deleteIcon && !deleted && <i
            class={"delete " + deleteIcon} data-click-event="remove-chip"/> }
    </div>;
}
