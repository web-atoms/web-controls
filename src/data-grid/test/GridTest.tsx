// tslint:disable
import Bind from "@web-atoms/core/dist/core/Bind"
import XNode from "@web-atoms/core/dist/core/XNode"
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import {AtomGridView} from "@web-atoms/core/dist/web/controls/AtomGridView";

    import GridTestViewModel from "./GridTestViewModel";
    import AtomDataGrid from "../AtomDataGrid";


export default class GridTest extends AtomGridView {	
	public create(): void {		this.viewModel =  this.resolve(GridTestViewModel) ;

		this.render(
		<div
			rows="5, 500 , *"
			columns="5, *, 5">
			<AtomDataGrid
				row="1"
				column="1"
				items={Bind.oneTime(() => this.viewModel.list)}>			</AtomDataGrid>
			<div
				rows="2">
				<span>
					Footer				</span>			</div>		</div>
		);	}}
