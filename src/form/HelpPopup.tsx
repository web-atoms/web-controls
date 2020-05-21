import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";

export default class HelpPopup extends AtomControl {

	public create(): void {

		this.render(
		<div
			style="padding:10px; margin:5px; border: 1px solid lightgray; background-color: white; border-radius: 5px;">
			<span text={Bind.oneWay(() => this.viewModel.message)}></span>
		</div>);
	}
}
