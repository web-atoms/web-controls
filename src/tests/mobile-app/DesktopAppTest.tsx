import InjectProperty from "@web-atoms/core/dist/core/InjectProperty.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { DrawerMenu, Home } from "./MobileAppTest.js";
import PageNavigator from "../../PageNavigator.js";
import MobileDesktopApp from "../../desktop-app/MobileDesktopApp.js";

@Pack
export default class DesktopAppTest extends MobileDesktopApp {

    async init() {
        this.drawerMenu = DrawerMenu;
        PageNavigator.openPage(Home, { title: "Home" });
    }

}

