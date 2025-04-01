import XNode from "@web-atoms/core/dist/core/XNode";

import "../styles/limited-text.global.css";

const toggleDetails = (e: Event) => {
    let start = e.target as HTMLElement;
    if (e.defaultPrevented) {
        return;
    }
    start = start.parentElement;
    const container = start;
    start = start?.parentElement;
    if (!start || start.getAttribute("data-limited-text") !== "limited-text") {
        return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    if(start.getAttribute("data-mode") === "collapsed") {
        start.setAttribute("data-mode", "open");
        start.style.maxHeight = "";
        container.style.top = "";
    } else {
        const h = start.getAttribute("data-max-height");
        start.style.maxHeight = h;
        container.style.top = h;
        start.setAttribute("data-mode", "collapsed");
    }
};

let setEventHandler = () => {
    document.body.addEventListener("click", toggleDetails);
    setEventHandler = null;
};

export default function LimitedText({
    text = "",
    height = 100 as (number | string),
    ... a
}, ... nodes: XNode[]) {

    setEventHandler?.();

    const h = typeof height === "number" ? `${height}px` : height;
    return <div
        data-mode="collapsed"
        data-max-height={h}
        style-max-height={h}
        data-limited-text="limited-text"
        {... a}>
        { text && <p text={text}/> }
        { ... nodes}
        <div
            style-top={h}
            data-element="more">
            <button
                class="fa-solid fa-angles-up"/>
        </div>
    </div>;
}