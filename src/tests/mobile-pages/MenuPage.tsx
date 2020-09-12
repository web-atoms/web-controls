// tslint:disable
import Bind from "@web-atoms/core/dist/core/Bind"
import XNode from "@web-atoms/core/dist/core/XNode"
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";

    import MenuPageViewModel from "./MenuPageViewModel";


export default class MenuPage extends AtomControl {	
	constructor(app: any, e?: any) {		super(app, e || document.createElement("div"));	}

	public create(): void {		this.viewModel =  this.resolve(MenuPageViewModel) ;

		this.render(
		<div>
			<button
				eventClick={Bind.event((x) => this.viewModel.openListPage())}>
				Page 1			</button>
			<button>
				Page 2			</button>		</div>
		);	}}
