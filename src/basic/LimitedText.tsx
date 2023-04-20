import XNode from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
        position: relative;
        overflow: hidden;
    `
    .child("[data-element=more]", styled.css `
        display: flex;
        justify-content: flex-end;
        width: 100%;
        right: 0;
        left: 0;
        bottom: 0;
        position: absolute;
    `.child("button", styled.css `
            padding: 1px;
            padding-left: 10px;
            padding-right: 10px;
            border-radius: 9999px;
            border: none;
            outline: none;
            box-shadow: 0 0 6px 6px white;
            transition: transform 0.5s ease-out;
        `)
    )
    .and("[data-mode=collapsed]",
        styled.css ``.child("[data-element=more]", styled.css `
            cursor: pointer;
            background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 19%, rgba(255,255,255,1) 65%, rgba(255,255,255,1) 100%);
        `.child("button", styled.css `
            transform: rotate(180deg);
        `)
        )
    ).installGlobal("[data-limited-text]")

const toggleDetails = (e: Event) => {
    let start = e.target as HTMLElement;
    if (e.defaultPrevented) {
        return;
    }
    start = start.parentElement;
    start = start?.parentElement;
    if (start.getAttribute("data-limited-text") !== "limited-text") {
        return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    if(start.getAttribute("data-mode") === "collapsed") {
        start.setAttribute("data-mode", "open");
        start.style.maxHeight = "";
    } else {
        start.style.maxHeight = start.getAttribute("data-max-height");
        start.setAttribute("data-mode", "collapsed");
    }
};

let setEventHandler = () => {
    document.body.addEventListener("click", toggleDetails);
    setEventHandler = null;
};

export default function LimitedText({
    text,
    height = 100,
    ... a
}) {

    setEventHandler?.();

    const h = `${height}px`;
    return <div
        data-mode="collapsed"
        data-max-height={h}
        style-max-height={h}
        data-limited-text="limited-text"
        {... a}>
        <p text={text}/>
        <div
            data-element="more">
            <button
                class="fa-solid fa-angles-up"/>
        </div>
    </div>;
}