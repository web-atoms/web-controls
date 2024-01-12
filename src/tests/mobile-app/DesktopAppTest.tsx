import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import Pack from "@web-atoms/core/dist/Pack";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import DesktopApp from "../../desktop-app/DesktopApp";
import MobileApp, { PopupWindowPage } from "../../mobile-app/MobileApp";
import { DrawerMenu, Home } from "./MobileAppTest";
import PageNavigator from "../../PageNavigator";

@Pack
export default class DesktopAppTest extends DesktopApp {

    @InjectProperty
    private navigationService: NavigationService;

    protected init() {
        MobileApp.current.drawer = DrawerMenu;
        this.navigationService.openPage(Home, { title: "Home" }, { target: "app"});
    }

}

