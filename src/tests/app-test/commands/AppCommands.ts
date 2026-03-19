import Command, { Commands } from "@web-atoms/core/dist/core/Command.js";

export default class AppCommands extends Commands {
    
    static home = Command.create({
        route: "/",
        routeOrder: 1000,
        openPage: () => import("../pages/home/HomePage")
    });

    static list = Command.create({
        route: "/list",
        openPage: () => import("../pages/list/ListPage")
    });
}