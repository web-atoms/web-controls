import Bind from "@web-atoms/core/dist/core/Bind";
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomPageFrameStyle, { FrameStyle } from "./AtomPageFrameStyle";

export default class AtomPageFrameTemplate extends AtomControl {

	public  url: string;

	public titlePresenter: HTMLElement ;

	public commandPresenter: HTMLElement ;

	public  pagePresenter: HTMLElement ;

	public  tabsPresenter: HTMLElement ;

	public  tabs: any  ;

	public create(): void {

		this.defaultControlStyle = AtomPageFrameStyle;

		this.render(
		<div class={this.controlStyle.name}>
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

	protected preCreate() {
		this.url = null;
		this.titlePresenter = null;
		this.commandPresenter = null;
		this.pagePresenter = null;
		this.tabsPresenter = null;
		this.tabs = null;
	}
}
