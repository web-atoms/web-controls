import XNode from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
        position: relative;
        overflow: hidden;
        contain: content;

        &[data-mode=collapsed] {
            & > [data-element=more] {
                cursor: pointer;
                background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 19%, rgba(255,255,255,1) 65%, rgba(255,255,255,1) 100%);
                & > button {
                    transform: rotate(180deg);
                }
            }
        }

        & > [data-element=more] {
            display: flex;
            justify-content: flex-end;
            width: 100%;
            right: 0;
            left: 0;
            position: absolute;
            transform: translateY(-100%);
            & > button {
                padding: 1px;
                padding-left: 10px;
                padding-right: 10px;
                border-radius: 9999px;
                border: none;
                outline: none;
                box-shadow: 0 0 6px 6px white;
                transition: transform 0.5s ease-out;
            }
        }

    `.installGlobal("[data-limited-text]")

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