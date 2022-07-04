import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

interface ISwipeStart {
    element: HTMLElement;
    x: number;
}

let swipeStart: ISwipeStart = null;

CSS(StyleRule()
    .display("grid")
    .alignItems("stretch")
    .justifyContent("stretch" as any)
    .child(StyleRule("*")
        .gridRow("1")
        .gridColumn("1")
    )
, "[data-swipe]");

document.body.addEventListener("touchstart", (e: TouchEvent) => {
    let element = e.target as HTMLElement;
    if (e.touches.length > 1) {
        return;
    }
    while (element) {
        if (element.dataset.swipe) {
            break;
        }
        element = element.parentElement;
    }
    if (!element) {
        return;
    }
    const { left } = element.getBoundingClientRect();
    swipeStart = {
        element,
        x: e.touches[0].screenX - left
    };
});

document.body.addEventListener("touchmove", (e: TouchEvent) => {
    let element = e.target as HTMLElement;
    if (!swipeStart || e.touches.length > 1) {
        return;
    }
    let swipe;
    while (element) {
        swipe = element.dataset.swipe;
        if (swipe) {
            break;
        }
        element = element.parentElement;
    }
    if (!element) {
        return;
    }

    // check left...
    const { left } = element.getBoundingClientRect();
    const cx = e.touches[0].screenX - left;
    const { x } = swipeStart;
    if (x < cx) {
        // swipe right..
        if (swipe !== "right") {
            return;
        }
    } else {
        if (swipe !== "left") {
            return;
        }
        let child = element.firstElementChild;
        while (child) {
            
        }
    }
});

document.body.addEventListener("touchend", (e: TouchEvent) => {
    swipeStart = null;
});

export function SwipeLeft(a, ... nodes: XNode[]) {
    return <div
        data-swipe="left"
        {... a}>
        { ... nodes }
    </div>;
}
