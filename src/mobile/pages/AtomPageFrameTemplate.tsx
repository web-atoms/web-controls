import Bind from "@web-atoms/core/dist/core/Bind";
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomPageFrameStyle, { FrameStyle } from "./AtomPageFrameStyle";

export default class AtomPageFrameTemplate extends AtomControl {

	@BindableProperty
	public  url: string;

	@BindableProperty
	public titlePresenter: HTMLElement ;

	@BindableProperty
	public commandPresenter: HTMLElement ;

	@BindableProperty
	public  pagePresenter: HTMLElement ;

	@BindableProperty
	public  tabsPresenter: HTMLElement ;

	@BindableProperty
	public  tabs: any  ;

	public create(): void {

		this.defaultControlStyle = AtomPageFrameStyle;

		this.render(
		<div class={this.controlStyle.root.className}>
			<div class="title-bar">
				<span
					class={Bind.oneWay(() => `icon fas ${this.localViewModel.canGoBack ? "fa-arrow-left" : "fa-bars" }`)}
					eventClick={Bind.event(() => this.localViewModel.iconClick())}></span>
				<div
					class="title"
					presenter={Bind.presenter("titlePresenter")}></div>
				<div
					class="commands"
					presenter={Bind.presenter("commandPresenter")}></div>
			</div>

			<div
				class="page-presenter"
				presenter={Bind.presenter("pagePresenter")}></div>

			<div
				class="tabs"
				styleDisplay={Bind.oneWay(() => this.tabs ? "" : "none")}
				presenter={Bind.presenter("tabsPresenter")}></div>
		</div>
		);
	}
}
