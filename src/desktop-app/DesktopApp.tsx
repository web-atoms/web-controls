import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { ChildEnumerator } from "@web-atoms/core/dist/web/core/AtomUI";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import MobileApp, { Drawer } from "../mobile-app/MobileApp";

CSS(StyleRule()
    .position("relative")
    .overflow("hidden")
    .display("grid")
    .minWidth(900)
    .gridTemplateRows("1fr auto")
    .gridTemplateColumns("auto 1fr auto")
    .child(StyleRule("[data-page-element=app]")
        .gridRow("1")
        .gridColumn("2")
        .position("inherit")
    )
    .child(StyleRule("[data-page-element=menu-renderer]")
        .gridRow("1")
        .gridColumn("1")
        .overflowX("hidden")
        .overflowY("auto")
    )
    .child(StyleRule("[data-page-element=side-bar]")
        .gridRow("1")
        .gridColumn("3")
        .overflowX("hidden")
        .overflowY("auto")
    )
    .child(StyleRule("[data-page-element=status-bar]")
        .gridRow("2")
        .gridColumn("1 / span 3")
        .padding(5)
        .marginTop(2)
        .borderTop("solid 1px lightgray")
        .overflow("hidden")
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

    @BindableProperty
    public menuRenderer: () => XNode;

    @BindableProperty
    public sideBarRenderer: () => XNode;

    @BindableProperty
    public statusBarRenderer: () => XNode;

    private initialized: boolean;

    public onPropertyChanged(name) {
        super.onPropertyChanged(name);

        if (!this.initialized) {
            return;
        }
        switch (name) {
            case "statusBarRenderer":
                this.recreate(name, "status-bar");
                break;
            case "menuRenderer":
                this.recreate(name, "menu-renderer");
                break;
            case "sideBarRenderer":
                this.recreate(name, "side-bar");
                break;
        }
    }

    protected init(): any {

    }

    protected recreate(renderer, name, remove = true): HTMLElement {
        const node = this[renderer]?.() ?? undefined;
        if (remove) {
            for (const e of ChildEnumerator.enumerate(this.element)) {
                if (e.dataset.pageElement === name) {
                    this.dispose(e);
                    e.remove();
                    break;
                }
            }
        }
        if (node) {
            const na = node.attributes ??= {};
            na["data-page-element"] = name;
            this.render(<div>{node}</div>);
            return this.element.querySelector(`[data-page-element="${name}"]`);
        }
        return null;
    }

    protected create() {

        this.render(<div data-desktop-app="desktop-app">
            <MobileApp data-page-element="app" />
        </div>);

        this.recreate("menuRenderer", "menu-renderer", false);
        this.recreate("sideBarRenderer", "side-bar", false);
        this.recreate("statusBarRenderer", "status-bar", false);

        this.initialized = true;

        this.runAfterInit(() => {
            this.app.runAsync(() => this.init());
        });
    }

}
