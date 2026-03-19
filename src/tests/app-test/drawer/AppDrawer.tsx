import XNode from "@web-atoms/core/dist/core/XNode.js";
import { Drawer } from "../../../mobile-app/MobileApp.js";

export default class AppDrawer extends Drawer {

    async init() {
        this.render(<div>
            <div>
            </div>
        </div>);
    }

}