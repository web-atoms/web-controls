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
			styleClass={Bind.oneTime((x) => this.viewModel.comboBox.controlStyle.popup)}
			styleDisplay={Bind.oneWay((x) => x.viewModel.comboBox.items.length ? "" : "none")}>
			<AtomItemsControl
				items={Bind.oneWay((x) => x.viewModel.comboBox.items)}>
				<AtomItemsControl.itemTemplate>
					<AtomTemplateControl
						styleClass={Bind.oneWay((x) => ({
							[this.viewModel.comboBox.controlStyle.item.className]:
								x.data !== x.viewModel.comboBox.selectedItem,
							[this.viewModel.comboBox.controlStyle.selectedItem.className]:
								x.data === x.viewModel.comboBox.selectedItem
            			}))}
						eventClick={Bind.event((x) => (x.viewModel).close((x.data)))}
						contentTemplate={Bind.oneTime((x) => x.viewModel.comboBox.itemTemplate)}
						for="div">
					</AtomTemplateControl>
				</AtomItemsControl.itemTemplate>
			</AtomItemsControl>
		</div>
		);
	}
}
