import Bind from "@web-atoms/core/dist/core/Bind.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";

import "./SortByButton.global.css";
import AtomRepeater from "./AtomRepeater.js";

const BindRepeater = Bind.forControl<AtomRepeater>();

export default function SortByButton({
    header,
    icon = void 0,
    orderBy,
    orderByDesc,
    defaultOrder = "asc" as "asc" | "desc"
}) {
    const css = (a) => {
        if (a === orderBy) {
            return "fad fa-sort";
        }
        if (a === orderByDesc) {
            return "fad fa-sort fa-flip-vertical";
        }
        return "";
    };
    return <sort-by-button event-click={BindRepeater.event((s) => {
        if (s.orderBy === orderBy) {
            s.orderBy = orderByDesc;
            return;
        }
        if (s.orderBy === orderByDesc) {
            s.orderBy = orderBy;
            return;
        }
        if (defaultOrder === "desc") {
            s.orderBy = orderByDesc;
            return;
        }
        s.orderBy = orderBy;
    }
        )} >
        {icon && <i class="icon"/>}
        <label text={header}/>
        <i class={BindRepeater.oneWay((x) => css(x.orderBy))}/>
    </sort-by-button>;
}