// tslint:disable
import Bind from "@web-atoms/core/dist/core/Bind"
import XNode from "@web-atoms/core/dist/core/XNode"
import {BindableProperty} from "@web-atoms/core/dist/core/BindableProperty";

    import Page from "../Page";
    import ListPageViewModel from "./ListPageViewModel";


export default class ListPage extends Page {
	public create(): void {

		this.render(
		<div
			title="List Page"
			for="div">
			<div
				template="commandTemplate">
				<span
					class="fas fa-filter"
					eventClick={Bind.event((x) => this.viewModel.openFilter())}>
				<span
					class="fas fa-question-circle">


			    This is a list page;

			<button
				eventClick={Bind.event((x) => this.viewModel.openDetail())}>
				Open Detail Page
		);