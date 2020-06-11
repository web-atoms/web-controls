import Bind from "@web-atoms/core/dist/core/Bind";
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";

import Page from "../../mobile/pages/Page";
import ListPageViewModel from "../mobile-pages/ListPageViewModel";

export default class ListPage extends Page {

	public create(): void {
		this.viewModel =  this.resolve(ListPageViewModel) ;

		this.render(
		<div
			title="List Page"
			for="div">
			<Page.commandTemplate>
				<div>
					<span
						class="fas fa-filter"
						eventClick={Bind.event((x) => this.viewModel.openFilter())}>
					</span>
					<span
						class="fas fa-question-circle">
					</span>
				</div>
			</Page.commandTemplate>

			    This is a list page;

			<button
				eventClick={Bind.event((x) => this.viewModel.openDetail())}>
				Open Detail Page
			</button>
		</div>
		);
	}
}
