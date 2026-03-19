import { AtomViewModel } from "@web-atoms/core/dist/view-model/AtomViewModel.js";
import { AtomWindowViewModel } from "@web-atoms/core/dist/view-model/AtomWindowViewModel.js";
import AutoCompleteBox from "./AutoCompleteBox.js";

export default class AppComboBoxViewModel extends AtomWindowViewModel {

    public comboBox: AutoCompleteBox;

    public init(): Promise<void> {
        (this.comboBox as any).windowViewModel = this;
        return super.init();
    }

}
