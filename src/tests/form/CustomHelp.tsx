import XNode from "@web-atoms/core/dist/core/XNode.js";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl.js";

export default class CustomHelp extends AtomControl {

	public create(): void {
		this.render(<div>
			This is custom help window <br/>
			<span>with different styles and</span>
			<span style="color: green"> colors</span>
		</div>);
	}
}
