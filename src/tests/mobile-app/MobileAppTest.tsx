import InjectProperty from "@web-atoms/core/dist/core/InjectProperty.js";
import sleep from "@web-atoms/core/dist/core/sleep.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { MenuItem } from "../../basic/PopupButton.js";
import BottomPopup from "../../mobile-app/BottomPopup.js";
import MobileApp, { ContentPage, Drawer,  PullToRefresh } from "../../mobile-app/MobileApp.js";
import PageNavigator from "../../PageNavigator.js";

class Detail extends ContentPage {
    protected create(): void {
        this.render(<div>
            This is the detail page
        </div>);
    }
}

class List extends ContentPage {

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
        void PageNavigator.openPage(Detail, { title: "Detail" });
    }
}

export class DrawerMenu extends Drawer {

    protected create(): void {
        this.render(<div>
            <header>Some Icon</header>
            <button event-click={() => this.openList()}>List</button>
        </div>);
    }

    protected openList() {
        void PageNavigator.openPage(List, { title: "List"});
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

    protected create(): void {
        this.drawer = DrawerMenu;

        PageNavigator.openPage(Home, { title: "Home" });

        this.app.runAsync(async () => {
            await sleep(1);
            PageNavigator.pushPage(Detail);
        });
    }

}
