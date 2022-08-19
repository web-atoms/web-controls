import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomChips, { Chip } from "../../../basic/AtomChips";
import GridTestViewModel, { ICurrencyInfo } from "../../data-grid/GridTestViewModel";

@Pack
export default class ChipsTest extends AtomControl {

    public viewModel: GridTestViewModel;

    private selectedChips: ICurrencyInfo[];

    protected create(): void {
        this.viewModel = this.resolve(GridTestViewModel);
        this.selectedChips = [];
        this.render(<div>
            <AtomChips
                enableDragDrop={true}
                items={Bind.oneWay(() => this.selectedChips)}
                suggestions={Bind.oneWay(() => this.viewModel.list)}
                itemRenderer={(item: ICurrencyInfo) =>
                    <Chip
                        draggable={true}
                        header={item.currency}
                        label={item.currencyCode}
                    />}
                suggestionRenderer={(item: ICurrencyInfo) => <div text={`${item.currency} (${item.currencyCode})`}/>}
                />
            <div>
                Selection popup will be displayed on the top of this text.
            </div>
        </div>);
    }

}
