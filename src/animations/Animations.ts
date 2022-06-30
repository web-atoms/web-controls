import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

CSS(StyleRule()
    .transform("translate(0,100%)" as any)
    .transition("all 0.5s ease-out")
    .and(StyleRule("[data-ready=true]")
        .transform("translate(0,0)" as any)
    )
,
"*[data-animate-slide=from-bottom]");

export default class Animations {

    public static slideFromBottom = AtomControl.registerProperty("animate", "bottom-slide", (ctrl, e, v) => {
        e.dataset.animateSlide="from-bottom";
        if (v) {
            e.dataset.ready = "false";
            e.style.display = "";
            setTimeout(() => {
                e.dataset.ready = "true";
            }, 100);
            return;
        } else {
            if (e.dataset.ready) {
                e.dataset.ready = "false";
                setTimeout(() => {
                    e.style.display = "none";
                }, 600);
                return;
            }
            e.dataset.ready = "false";
            e.style.display = "none";            
        }
    });

}
