import Bind from "@web-atoms/core/dist/core/Bind.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl.js";

export default class HelpPopup extends AtomControl {

	public create(): void {

		this.render(
		<div
			style="padding:10px; margin:5px; border: 1px solid lightgray; background-color: white; border-radius: 5px;">
			<span text={Bind.oneWay(() => this.viewModel.message)}></span>
		</div>);
	}
}
