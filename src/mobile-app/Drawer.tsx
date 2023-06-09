import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";


export class Drawer extends AtomControl {

    // tslint:disable-next-line: no-empty
    protected init(): any { }

    protected preCreate(): void {
        this.element.dataset.drawerPage = "drawer-page";
        this.bindEvent(this.element, "click", (e: Event) => e.defaultPrevented ? null : this.closeDrawer());
        this.runAfterInit(() => this.app.runAsync(() => this.init?.()));
    }

    protected closeDrawer() {
        const ce = new CustomEvent("closeDrawer", { bubbles: true });
        this.element.dispatchEvent(ce);
    }
}

delete (Drawer.prototype as any).init;
