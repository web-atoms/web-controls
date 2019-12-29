import Bind from "@web-atoms/core/dist/core/xnode/Bind";
import XNode from "@web-atoms/core/dist/core/xnode/XNode";
import {AtomControl} from "@web-atoms/core/dist/web/controls/AtomControl";
import setupBridge from "../../setupBridge";
import AtomField from "../AtomField";
import AtomForm from "../AtomForm";
import FormViewModel from "./FormViewModel";

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
