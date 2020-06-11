// tslint:disable
import Bind from "@web-atoms/core/dist/core/Bind"
import XNode from "@web-atoms/core/dist/core/XNode"
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";

    import AtomPageFrame from "../../mobile/pages/AtomPageFrame";



export default class PageApp extends AtomPageFrame {
	
	public create(): void {
		
		this.render(
		<div
			url="@web-atoms/web-controls/dist/mobile/pages/sample/HomePage"
			menuUrl="@web-atoms/web-controls/dist/mobile/pages/sample/MenuPage">
		</div>
		);
	}
}
