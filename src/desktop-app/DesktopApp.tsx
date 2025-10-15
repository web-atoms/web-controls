import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { ChildEnumerator } from "@web-atoms/core/dist/web/core/AtomUI";
import MobileApp from "../mobile-app/MobileApp";

import "../styles/desktop-app.global.css";
import Action from "@web-atoms/core/dist/view-model/Action";

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

    @Action({ onEvent: "iconClick"})
    onIconClick() {
        if(this.element.hasAttribute("drawer-hidden")) {
            this.element.removeAttribute("drawer-hidden");
        } else {
            this.element.setAttribute("drawer-hidden", "1");
        }
    }

    @Action({ onEvent: "hideDrawer"})
    onHideDrawer() {
        this.element.setAttribute("drawer-hidden", "1");
    }

}
