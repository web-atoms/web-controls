import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { AtomItemsControl } from "@web-atoms/core/dist/web/controls/AtomItemsControl";
import { AtomTemplateControl } from "@web-atoms/core/dist/web/controls/AtomTemplateControl";
import AppComboBoxViewModel from "./AppComboBoxViewModel";

export default class ItemHost extends AtomControl {

	public viewModel: AppComboBoxViewModel;

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
