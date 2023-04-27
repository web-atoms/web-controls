import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import MobileApp, { Drawer } from "../mobile-app/MobileApp";
import { isMobileView } from "../mobile-app/MobileApp";
import DesktopApp from "./DesktopApp";
import XNode from "@web-atoms/core/dist/core/XNode";

const T = isMobileView ? MobileApp : DesktopApp;

export default abstract class MobileDesktopApp extends (T as any as typeof AtomControl) {

    public mobileApp: MobileApp;

    public desktopApp: DesktopApp;

    public get drawerMenu() {
        return this.menu;
    }
    public set drawerMenu(v: typeof Drawer) {
        this.menu = v;
        if (this.mobileApp) {
            this.mobileApp.drawer = v;
        } else {
            this.desktopApp.menuRenderer = () => XNode.create(v, {});
        }
    }

    public abstract init(): Promise<any>;

    private menu: typeof Drawer;

    protected preCreate(): void {
        super.preCreate();
        if (isMobileView) {
            this.mobileApp = this as any as MobileApp;
        } else {
            this.desktopApp = this as any as DesktopApp;
        }
    }

}