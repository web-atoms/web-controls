import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import Pack from "@web-atoms/core/dist/Pack";
import { DrawerMenu, Home } from "./MobileAppTest";
import PageNavigator from "../../PageNavigator";
import MobileDesktopApp from "../../desktop-app/MobileDesktopApp";

@Pack
export default class DesktopAppTest extends MobileDesktopApp {

    async init() {
        this.drawerMenu = DrawerMenu;
        PageNavigator.openPage(Home, { title: "Home" });
    }

}

