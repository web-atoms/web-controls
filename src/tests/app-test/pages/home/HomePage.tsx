import XNode from "@web-atoms/core/dist/core/XNode";
import { ContentPage } from "../../../../mobile-app/MobileApp";
import AppCommands from "../../commands/AppCommands";

export default class HomePage extends ContentPage {

    async init() {
        this.renderer = <div>
            This is a Home Page
            <br/>
            <a href={AppCommands.list.displayRoute({})} data-click-event="route">List</a>
        </div>;
    }
}