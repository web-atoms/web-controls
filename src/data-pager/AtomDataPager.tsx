import Bind from "@web-atoms/core/dist/core/Bind";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomViewModel, Watch } from "@web-atoms/core/dist/view-model/AtomViewModel";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { AtomItemsControl } from "@web-atoms/core/dist/web/controls/AtomItemsControl";
import { AtomStyle } from "@web-atoms/core/dist/web/styles/AtomStyle";
import { IStyleDeclaration } from "@web-atoms/core/dist/web/styles/IStyleDeclaration";

export class AtomDataPagerViewModel extends AtomViewModel {

    public owner: AtomDataPager;

    @Watch
    public get pages() {
        const r = [];
        const size = this.owner.size;
        if (size <= 0) {
            return r;
        }
        const total = Math.ceil(this.owner.total / size);
        let current = this.owner.current;
        if (current === null) {
            current = 0;
            this.owner.current = 0;
        }
        if (current >= total) {
            current = total - 1;
        }
        const start = Math.max(0, current <= 2
            ? 0
            : (current + 5 > total ? (total - 5) : current - 3));
        const max = Math.min(start + 5, total);
        for (let index = start; index < max; index++) {
            r.push({
                label: `${index + 1}`,
                value: index
            });
        }
        return r;
    }

}

export class AtomDataPagerStyle extends AtomStyle {
    public get root(): IStyleDeclaration {
        return {
            subclasses: {
                " button": {
                    margin: "5px"
                },
                " button.selected": {
                    margin: "5px",
                    backgroundColor: Colors.blue,
                    color: Colors.white
                }
            }
        };
    }
}

export default class AtomDataPager extends AtomControl {

    public total: number;

    public size: number;

    public current: number;

    public localViewModel: AtomDataPagerViewModel;

    public create() {
        this.defaultControlStyle = AtomDataPagerStyle;
        this.current = 0;
        this.size = 0;
        this.total = 0;
        this.localViewModel = this.resolve(AtomDataPagerViewModel, "owner");
        this.render(<div
            styleClass={this.controlStyle.name}
            // styleDisplay={Bind.oneWay(() => this.total > this.size ? "" : "none")}
            >
            <button
                eventClick={Bind.event(() => this.current = 0)}
                text="First"/>
            <AtomItemsControl
                for="span"
                items={Bind.oneWay(() => this.localViewModel.pages)}>
                <AtomItemsControl.itemTemplate>
                    <button
                        styleClass={Bind.oneWay((x) => ({
                            item: 1,
                            selected: x.data.value === this.current
                        }) )}
                        eventClick={Bind.event((x) => this.current = x.data.value )}
                        text={Bind.oneTime((x) => x.data.label)}
                        />
                </AtomItemsControl.itemTemplate>
            </AtomItemsControl>
            <button
                eventClick={Bind.event(() => this.current = this.total > 0
                    ? Math.floor(this.total / this.size)
                    : 0)}
                text="Last"/>
        </div>);
    }

}
