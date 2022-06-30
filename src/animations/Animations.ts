import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

CSS(StyleRule()
    .and(StyleRule(":not([data-animation-state])")
        .display("none")
    )
    .and(StyleRule("[data-animation-state=down]")
        .transform("translate(0,100%)" as any)
    )
    .and(StyleRule("[data-animation-state=up]")
        .transform("translate(0,0)" as any)
    )
    .transition("all 0.5s ease-out")
,
"*[data-animate-slide=from-bottom]");

export default class Animations {

    public static slideFromBottom = AtomControl.registerProperty("animate", "bottom-slide", (ctrl, e, v) => {
        e.dataset.animateSlide="from-bottom";
        if (v) {
            e.dataset.animationState = "down";
            setTimeout(() => {
                e.dataset.animationState = "up";
            }, 10);
            return;
        } else {
            e.dataset.animationState = "down";
            setTimeout(() => {
                e.removeAttribute("data-animation-state");
            }, 600);
        }
    });

}
