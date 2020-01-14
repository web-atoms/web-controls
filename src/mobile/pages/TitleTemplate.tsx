import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";

export default class TitleTemplate extends AtomControl {

	constructor(a?: any, e?: any) {
		super(a, e || document.createElement("span"));
	}

	public create(): void {
		this.render(
		<span
			text={Bind.oneWay(
				() => (this.localViewModel.owner
					&& this.localViewModel.owner.current
					? this.localViewModel.owner.current.title : undefined)
					|| this.localViewModel.title)}
			></span>);
	}
}
