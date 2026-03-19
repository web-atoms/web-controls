import Bind from "@web-atoms/core/dist/core/Bind.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import { AtomItemsControl } from "@web-atoms/core/dist/web/controls/AtomItemsControl.js";
import { AtomTemplateControl } from "@web-atoms/core/dist/web/controls/AtomTemplateControl.js";
import AppComboBoxViewModel from "./AppComboBoxViewModel.js";

export default class ItemHost extends AtomControl {

	declare public viewModel: AppComboBoxViewModel;

	public create(): void {

		this.viewModel =  this.resolve(AppComboBoxViewModel) ;

		this.render(
		<div
			styleClass={Bind.oneTime((x) => this.viewModel.comboBox.controlStyle.name)}
			styleDisplay={Bind.oneWay(() => this.viewModel.comboBox.items.length ? "" : "none")}>
			<AtomItemsControl
				items={Bind.oneWay(() => this.viewModel.comboBox.items)}>
				<AtomItemsControl.itemTemplate>
					<AtomTemplateControl
						styleClass={Bind.oneWay((x) => ({
							"item": x.data !== this.viewModel.comboBox.selectedItem,
							"selected-item": x.data === this.viewModel.comboBox.selectedItem
            			}))}
						eventClick={Bind.event((x) => this.viewModel.close((x.data)))}
						contentTemplate={Bind.oneTime(() => this.viewModel.comboBox.itemTemplate)}
						for="div">
					</AtomTemplateControl>
				</AtomItemsControl.itemTemplate>
			</AtomItemsControl>
		</div>
		);
	}
}
