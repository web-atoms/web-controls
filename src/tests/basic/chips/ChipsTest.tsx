import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomChips, { Chip } from "../../../basic/AtomChips";
import GridTestViewModel, { ICurrencyInfo } from "../../data-grid/GridTestViewModel";

const css = CSS(StyleRule()
    .child(StyleRule("*")
        .flexLayout()
    )
);

@Pack
export default class ChipsTest extends AtomControl {

    public viewModel: GridTestViewModel;

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
