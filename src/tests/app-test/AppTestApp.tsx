import Route from "@web-atoms/core/dist/core/Route";
import MobileDesktopApp from "../../desktop-app/MobileDesktopApp";
import AppCommands from "./commands/AppCommands";
import Command from "@web-atoms/core/dist/core/Command";
import Pack from "@web-atoms/core/dist/Pack";

@Pack
export default class AppTestApp extends MobileDesktopApp {

    async init() {
        AppCommands.install(this);

        if(!Command.invokeRoute()) {

            // check if we are configured...
            AppCommands.home.dispatch();
        }
    }

}

Route.encodeUrl = (url) => {
    if (url.startsWith("#")) {
        return url;
    }
    return "#!" + url;
};
