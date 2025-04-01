import { AtomDisposableList } from "@web-atoms/core/dist/core/AtomDisposableList";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { isMobileView } from "../mobile-app/MobileApp";

import "../styles/resizable.global.css";
    
const pointerDown = (e: PointerEvent) => {

    const target = e.currentTarget as HTMLDivElement;
    const direction = target.getAttribute("data-direction");

    const previous = target.parentElement as HTMLElement;

    const disposables = new AtomDisposableList();
    const { x, y } = e;

    const width = previous.clientWidth;

    const control = AtomControl.from(target);

    target.setPointerCapture(e.pointerId);
    target.setAttribute("data-resizing", "1");

    disposables.add(() => {
        target.removeAttribute("data-resizing");
        target.releasePointerCapture(e.pointerId);
    });

    disposables.add(control.bindEvent(target, "pointermove", (ep: PointerEvent) => {
        const diff = ep.x - x;
        previous.style.width = (width + diff) + "px";
    }));

    disposables.add(control.bindEvent(target, "pointerup", (ep: PointerEvent) => {
        const diff = ep.x - x;
        previous.style.width = (width + diff) + "px";
        disposables.dispose();
    }));
};

export default function resizable({
    direction = "horizontal" as "horizontal" | "vertical",
    ... a
}, child: XNode) {

    if (isMobileView) {
        return child;
    }

    return <div
        { ... a}
        data-resizable="resizable"
        data-direction={direction}
        >
        { child }
        <div
            data-element="resizer"
            event-pointerdown={pointerDown}
            />
    </div>;

}