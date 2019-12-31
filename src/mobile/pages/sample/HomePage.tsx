// tslint:disable
import Bind from "@web-atoms/core/dist/core/Bind"
import XNode from "@web-atoms/core/dist/core/XNode"
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";

    import Page from "../Page";


export default class HomePage extends Page {	
	public create(): void {		
		this.render(
		<div
			title="Home Page"
			for="div">
			<div
				template="commandTemplate">
				<span
					class="fas fa-question-circle">				</span>			</div>

			    This is home page...
					</div>
		);	}}
