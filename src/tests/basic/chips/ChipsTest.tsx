import Bind from "@web-atoms/core/dist/core/Bind.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import AtomChips, { Chip } from "../../../basic/AtomChips.js";
import GridTestViewModel, { ICurrencyInfo } from "../../data-grid/GridTestViewModel.js";

import "./ChipsTest.local.css";
import { MatchCaseInsensitive } from "../../../basic/AtomRepeater.js";

const css = "chip-test";

@Pack
export default class ChipsTest extends AtomControl {

    declare public viewModel: GridTestViewModel;

    private selectedChips: ICurrencyInfo[];

    protected create(): void {
        this.viewModel = this.resolve(GridTestViewModel);
        this.selectedChips = [];
        this.render(<div class={css}>
            <div>
            <AtomChips
                enableDragDrop={true}
                items={Bind.oneWay(() => this.selectedChips)}
                suggestions={Bind.oneWay(() => this.viewModel.list)}
                itemRenderer={(item: ICurrencyInfo) =>
                    <Chip
                        draggable={true}
                        deleted={item.$deleted}
                        header={item.currency}
                        label={item.currencyCode}
                    />}
                suggestionRenderer={(item: ICurrencyInfo) => <div text={`${item.currency} (${item.currencyCode})`}/>}
                />
                <i class="fas fa-question"/>
            </div>
            <div>
                Selection popup will be displayed on the top of this text.
            </div>
        </div>);
    }

}
