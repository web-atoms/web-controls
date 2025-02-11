import XNode from "@web-atoms/core/dist/core/XNode";
import { Drawer } from "../../../mobile-app/MobileApp";

export default class AppDrawer extends Drawer {

    async init() {
        this.render(<div>
            <div>
            </div>
        </div>);
    }

}