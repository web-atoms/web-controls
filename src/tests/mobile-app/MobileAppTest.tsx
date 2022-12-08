import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import sleep from "@web-atoms/core/dist/core/sleep";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { MenuItem } from "../../basic/PopupButton";
import BottomPopup from "../../mobile-app/BottomPopup";
import MobileApp, { ContentPage, Drawer, PullToRefresh } from "../../mobile-app/MobileApp";

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
        this.pullToRefreshRenderer = PullToRefresh;
        const items = [];
        for (let index = 0; index < 100; index++) {
            items.push(<div event-click={() => this.openDetail()}>Line Item {index.toString()}</div>);
        }
        this.render(<div>
            A big list page...
            <button event-click={() => this.openDetail()}>Open Detail</button>
            { ... items }
        </div>);
    }

    protected openDetail() {
        void this.navigationService.openPage(Detail, { title: "Detail" }, { target: "app"});
    }
}

export class DrawerMenu extends Drawer {

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

export class Home extends ContentPage {

    protected create(): void {

        this.actionRenderer = () => <i class="fad fa-search" event-click={() => PopupMenu.show()}/>;

        this.pullToRefreshRenderer = PullToRefresh;

        this.title = "App";

        this.render(<div>
            Home
        </div>);

        this.bindEvent(this.element, "reloadPage", () => sleep(2000));
    }
}

class PopupMenu extends BottomPopup {
    protected create() {
        this.titleRenderer = () => <span text="Choose"/>;
        this.closeRenderer = () => <i class="fas fa-times" />;
        // this.modal = false;
        this.render(<div>
            <MenuItem label="One"/>
            <MenuItem label="Two"/>
        </div>);
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
