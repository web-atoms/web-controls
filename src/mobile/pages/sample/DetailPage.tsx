import XNode from "@web-atoms/core/dist/core/XNode";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";
import Page from "../Page";

export default class DetailPage extends Page {

	public create(): void {

		this.render(<div title="Detail Page">
		This is detail page...
		<div template="tabsTemplate">
			<div>Page Tab</div>
		</div>
	</div>);
	}
}
