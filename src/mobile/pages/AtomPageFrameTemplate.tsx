import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomPageFrameStyle, { FrameStyle } from "./AtomPageFrameStyle";
import XNode from "@web-atoms/core/dist/core/xnode/XNode";
import Bind from "@web-atoms/core/dist/core/xnode/Bind";

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
					eventClick={Bind.oneTime(() => this.localViewModel.iconClick())}></span>
				<div
					class="title"
					titlePresenter={Bind.presenter}></div>
				<div
					class="commands"
					commandPresenter={Bind.presenter}></div>
			</div>

			<div
				class="page-presenter"
				pagePresenter={Bind.presenter}></div>

			<div
				class="tabs"
				styleDisplay={Bind.oneWay(() => this.tabs ? "" : "none")}
				tabsPresenter={Bind.presenter}></div>
		</div>
		);
	}
}
