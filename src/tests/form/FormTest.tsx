import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomField from "../../form/AtomField";
import AtomForm from "../../form/AtomForm";
import setupBridge from "../../setupBridge";
import FormViewModel from "./FormViewModel";

@Pack
export default class FormTest extends AtomControl {

	public viewModel: FormViewModel;

	public create(): void {

		this.viewModel =  this.resolve(FormViewModel) ;

		this.render(<div>
				<AtomForm
				eventSubmit={Bind.event(() => alert("done"))}
				focusNextOnEnter={true}>
				<AtomField
					label="Name:"
					required={true}
					error={Bind.oneWay(() => this.viewModel.errorName)}>
					<input type="text" value={Bind.twoWays(() => this.viewModel.model.name)}/>
				</AtomField>
				<AtomField
					label="Email:"
					required={true}
					error={Bind.oneWay(() => this.viewModel.errorEmail)}>
					<input
						type="email"
						class="submit"
						value={Bind.twoWays(() => this.viewModel.model.email)}/>
				</AtomField>
				<AtomField>
					This is simple display text without label or anything
				</AtomField>
			</AtomForm>
			<button eventClick={Bind.event(() => this.viewModel.save())}>Save</button>
		</div>);
	}
}
