import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import { Drawer } from "../mobile-app/MobileApp";

CSS(StyleRule()
    
, "*[data-desktop-app=desktop-app]");

export default class DesktopApp extends AtomControl {

    public static current: DesktopApp;

    public static drawer = XNode.prepare("drawer", true, true);

    public drawer: typeof Drawer;
    
    protected preCreate() {
        DesktopApp.current = this;

        window.addEventListener("popstate", () => {
            // back button processing...
        });

        document.body.style.overflow = "hidden";

        this.element.dataset.desktopApp = "desktop-app";
    }

}
