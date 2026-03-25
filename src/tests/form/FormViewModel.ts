import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService.js";
import { AtomViewModel, Validate } from "@web-atoms/core/dist/view-model/AtomViewModel.js";
import PopupService from "@web-atoms/core/dist/web/services/PopupService";

export default class FormViewModel extends AtomViewModel {

    public model = {
        name: "",
        email: ""
    };

    @Validate
    public get errorName(): string {
        return this.model.name ? null : "Name is required";
    }

    @Validate
    public get errorEmail(): string {
        return this.model.email ? null : "Email is required";
    }

    public async save(): Promise<void> {
        if (!this.isValid) {
            await PopupService.alert({ message: "Please complete all required fields"});
        }
    }

}
