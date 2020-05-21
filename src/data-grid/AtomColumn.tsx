// tslint:disable
import Bind from "@web-atoms/core/dist/core/Bind"
import XNode from "@web-atoms/core/dist/core/XNode"
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";

    import FormattedString from "@web-atoms/core/dist/core/FormattedString";


export default class AtomColumn extends AtomControl {	
	constructor(app: any, e?: any) {		super(app, e || document.createElement("th"));	}

	@BindableProperty
	public label: string | FormattedString ;

	@BindableProperty
	public labelPath: string ;

	@BindableProperty
	public valuePath: string ;

	@BindableProperty
	public sort: any ;

	@BindableProperty
	public align: string ;

	@BindableProperty
	public headerTemplate: any ;

	@BindableProperty
	public footerTemplate: any ;

	@BindableProperty
	public dataTemplate: any ;

	public create(): void {		
		this.label = null;
		this.labelPath = null;
		this.valuePath = null;
		this.sort = null;
		this.align = 'left';
		this.headerTemplate = null;
		this.footerTemplate = null;
		this.dataTemplate = null;
		this.render(
		<div>
			<span
				template="headerTemplate"
				formattedText={Bind.oneWay(() => this.label)}>			</span>
			<span
				template="dataTemplate"
				styleTextAlign={Bind.oneWay(() => this.align)}
				formattedText={Bind.oneWay((x) => x.localViewModel.getItem(x.data, this.valuePath))}>			</span>		</div>
		);	}}
