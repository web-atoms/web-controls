import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { ChildEnumerator } from "@web-atoms/core/dist/web/core/AtomUI";
import MobileApp from "../mobile-app/MobileApp";
import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

    html, body {
        width: 100%;
        height: 100%;
    }

    body {
        overflow: hidden;
        display: flex;
        justify-content: space-around;
        align-items: stretch;
        align-content: stretch;
        flex-direction: row;
    }

    *[data-desktop-app=desktop-app] {
        position: relative;
        overflow: hidden;
        display: grid;
        min-width: 900px;
        grid-template-rows: 1fr auto;
        grid-template-columns: auto 1fr auto;
        
        & > [data-page-element=app] {
            grid-row: 1;
            grid-column: 2;
            position: inherit; 
        }

        & > [data-page-element=menu-renderer] {
            grid-row: 1;
            grid-column: 1;
            overflow-x: hidden;
            overflow-y: auto; 
        }
        
        & > [data-page-element=side-bar] {
            grid-row: 1;
            grid-column: 3;
            overflow-x: hidden;
            overflow-y: auto; 
        }
        
        & > [data-page-element=status-bar] {
            grid-row: 2;
            grid-column: 1 / span 3;
            padding: 5px;
            margin-top: 2px;
            border-top: solid 1px lightgray;
            overflow: hidden; 
        }
    }
    `.withId("*[data-desktop-app=desktop-app]").installGlobal();

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
