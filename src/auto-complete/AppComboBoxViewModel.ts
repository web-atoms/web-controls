import { AtomViewModel } from "@web-atoms/core/dist/view-model/AtomViewModel";
import { AtomWindowViewModel } from "@web-atoms/core/dist/view-model/AtomWindowViewModel";
import AutoCompleteBox from "./AutoCompleteBox";

export default class AppComboBoxViewModel extends AtomWindowViewModel {

    public comboBox: AutoCompleteBox;

    public init(): Promise<void> {
        (this.comboBox as any).windowViewModel = this;
        return super.init();
    }

}
