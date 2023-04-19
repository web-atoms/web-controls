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
        transform: translateY(-100%);
    `.child("button", styled.css `
            padding: 1px;
            padding-left: 10px;
            padding-right: 10px;
            border-radius: 9999px;
        `)
    )
    .and("[data-mode=collapsed]",
        styled.css ``.child("[data-element=more]", styled.css `
            cursor: pointer;
            background: linear-gradient(to top, rgba(255,255,255, 1) 1px, rgba(255,255,255, 0) 40px );
        `.child("button", styled.css `
            transform: rotate(180deg);
        `)
        )
    ).installGlobal("[data-limited-text]")

const toggleDetails = (e: Event) => {
    let start = e.target as HTMLElement;
    start = start.parentElement;
    start = start?.parentElement;
    if (start.getAttribute("data-limited-text") !== "limited-text") {
        return;
    }
    if(start.getAttribute("data-mode") === "collapsed") {
        start.setAttribute("data-mode", "open");
        start.style.maxHeight = "";
    } else {
        start.style.maxHeight = start.getAttribute("data-max-height");
        start.setAttribute("data-mode", "collapsed");
    }
};

export default function LimitedText({
    text,
    height = 200,
    ... a
}) {
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
                event-click={toggleDetails}
                class="fa-solid fa-angles-up"/>
        </div>
    </div>;
}