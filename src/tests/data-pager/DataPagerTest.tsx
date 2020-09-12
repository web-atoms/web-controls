import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomComboBox } from "@web-atoms/core/dist/web/controls/AtomComboBox";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomDataPager from "../../data-pager/AtomDataPager";

const items = (() => {
    const r = [];
    for (let index = 0; index < 100; index += 4) {
        r.push({ label: index + "", value: index });
    }
    return r;
})();

export default class DataPagerTest extends AtomControl {

    public total: number = 0;

    public create() {
        this.total = 0;
        this.render(
            <div>
                <AtomComboBox
                    value={Bind.twoWays(() => this.total)}
                    items={items}/>
                <AtomDataPager
                    size={3}
                    total={Bind.twoWays(() => this.total )}
                    />
            </div>
        );
    }

}
