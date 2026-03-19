import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";

import "./Animations.global.css";


export default class Animations {

    public static slideFromBottom = AtomControl.registerProperty("animate", "bottom-slide", (ctrl, e, v) => {
        e.dataset.animateSlide = "from-bottom";
        if (v) {
            e.dataset.animationState = "down";
            setTimeout(() => {
                e.dataset.animationState = "normal";
            }, 10);
            return;
        }
        if (e.dataset.animationState === "normal") {
            e.dataset.animationState = "down";
        }
        setTimeout(() => {
            e.removeAttribute("data-animation-state");
        }, 600);
    });

    public static slideFromTop = AtomControl.registerProperty("animate", "top-slide", (ctrl, e, v) => {
        e.dataset.animateSlide = "from-top";
        if (v) {
            e.dataset.animationState = "up";
            setTimeout(() => {
                e.dataset.animationState = "normal";
            }, 10);
            return;
        }
        if (e.dataset.animationState === "normal") {
            e.dataset.animationState = "up";
        }
        setTimeout(() => {
            e.removeAttribute("data-animation-state");
        }, 600);
    });

}
