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
    .child(StyleRule("*")
        .gridRow("1")
        .gridColumn("1")
    )
, "[data-swipe]");

CSS(StyleRule()
    .child(StyleRule("*")
        .alignSelf("center")
        .justifySelf("end" as any)
        .zIndex(2)
        .and(StyleRule(":first-child")
            .alignSelf("stretch")
            .justifySelf("stretch" as any)
            .zIndex(10)
        )
    )
, "[data-swipe=left]");


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
    let diff = cx - x;
    if (diff > 0) {
        // swipe right..
        if (swipe !== "right") {
            return;
        }
    } else {
        if (swipe !== "left") {
            return;
        }
        let content = element.firstElementChild as HTMLElement;
        let maxMargin = 0;
        let child = content?.nextElementSibling as HTMLElement;
        let count = 0;
        while (child) {
            maxMargin += child.offsetWidth;
            count++;
            child = child.nextElementSibling as HTMLElement;
        }
        let margin = -diff;
        if (maxMargin && margin > maxMargin) {
            margin = maxMargin;
        }
        if (margin <= 5) {
            delete content.style.marginRight;
            delete content.style.transform;
            child = content?.nextElementSibling as HTMLElement;
            while (child) {
                delete child.style.marginRight;
                child = child.nextElementSibling as HTMLElement;
            }
            return;
        }
        content.style.marginRight = `${margin}px`;
        content.style.transform = `translateX(-${margin}px)`;
        
        let avgMargin = Math.ceil(margin / count);
        child = content?.nextElementSibling as HTMLElement;
        while (child) {
            count--;
            if (count === 0) {
                break;
            }
            let m = (avgMargin * count) + 5;
            child.style.marginRight = `${m}px`;
            child = child.nextElementSibling as HTMLElement;
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
