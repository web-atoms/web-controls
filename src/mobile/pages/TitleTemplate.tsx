import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";

export default class TitleTemplate extends AtomControl {

	public create(): void {
		this.render(
		<span
			text={Bind.oneWay(
				() => this.localViewModel.owner.current.title
					|| this.localViewModel.title)}
			></span>);
	}
}
