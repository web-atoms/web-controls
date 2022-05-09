import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import MobileApp, { ContentPage, Drawer } from "../../mobile-app/MobileApp";

class Detail extends ContentPage {
    protected create(): void {
        this.render(<div>
            This is the detail page
        </div>);
    }
}

class List extends ContentPage {

    @InjectProperty
    private navigationService: NavigationService;

    protected create(): void {
        this.render(<div>
            A big list page...
            <button event-click={() => this.openDetail()}>Open Detail</button>
        </div>);
    }

    protected openDetail() {
        void this.navigationService.openPage(Detail, { title: "Detail" }, { target: "app"});
    }
}

class DrawerMenu extends Drawer {

    @InjectProperty
    private navigationService: NavigationService;

    protected create(): void {
        this.render(<div>
            <header>Some Icon</header>
            <button event-click={() => this.openList()}>List</button>
        </div>);
    }

    protected openList() {
        void this.navigationService.openPage(List, { title: "List"}, { target: "app"});
    }

}

class Home extends ContentPage {
    protected create(): void {
        this.render(<div>Home</div>);
    }
}

@Pack
export default class MobileAppTest extends MobileApp {

    @InjectProperty
    private navigationService: NavigationService;

    protected create(): void {
        this.drawer = DrawerMenu;

        this.navigationService.openPage(Home, { title: "Home" }, { target: "app"});
    }

}
