import XNode from "@web-atoms/core/dist/core/XNode";
import IElement from "./IElement";

import "./styles/chip-style";

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
        ... a
    }: IChip,
    ... nodes: XNode[]) {
    return <div
        { ... a}
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
