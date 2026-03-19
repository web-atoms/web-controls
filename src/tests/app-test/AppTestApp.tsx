import Route from "@web-atoms/core/dist/core/Route.js";
import MobileDesktopApp from "../../desktop-app/MobileDesktopApp.js";
import AppCommands from "./commands/AppCommands.js";
import Command from "@web-atoms/core/dist/core/Command.js";
import Pack from "@web-atoms/core/dist/Pack.js";

const fa = document.createElement("link");
fa.href = "https://dtzkc6yot8xw8.cloudfront.net/npm/package/@c8private/fa-icons@6.7.1/css/all.min.css";
fa.crossOrigin = "anonymous";
fa.rel = "stylesheet";
document.head.appendChild(fa);
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
