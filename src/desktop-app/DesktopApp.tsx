import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import MobileApp, { Drawer } from "../mobile-app/MobileApp";

CSS(StyleRule()
    .position("relative")
    .overflow("hidden")
    .display("grid")
    .minWidth(900)
    .gridTemplateRows("1fr auto")
    .gridTemplateColumns("auto 1fr auto")
    .child(StyleRule("[data-element=app]")
        .gridRow("1")
        .gridColumn("2")
        .position("inherit")
    )
    .child(StyleRule("[data-element=left]")
        .gridRow("1")
        .gridColumn("1")
        .overflow("auto")
    )
    .child(StyleRule("[data-element=right]")
        .gridRow("1")
        .gridColumn("3")
        .overflow("auto")
    )
, "*[data-desktop-app=desktop-app]");

CSS(StyleRule()
    .width("100%")
    .height("100%")
, "html,body");

CSS(StyleRule()
    .overflow("hidden")
    .display("flex")
    .justifyContent("space-around")
    .alignItems("stretch")
    .alignContent("stretch")
    .flexDirection("row")
, "body");

export default class DesktopApp extends AtomControl {

    protected init(): any {

    }

    protected create() {
        this.render(<div data-desktop-app="desktop-app">
            <MobileApp data-element="app" />
        </div>);

        this.runAfterInit(() => {
            this.app.runAsync(() => this.init());
        });
    }

}
