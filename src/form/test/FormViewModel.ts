import { Inject } from "@web-atoms/core/dist/di/Inject";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import { AtomViewModel, Validate } from "@web-atoms/core/dist/view-model/AtomViewModel";

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

    @Inject
    private navigationService: NavigationService;

    public async save(): Promise<void> {
        if (!this.isValid) {
            await this.navigationService.alert("Please complete all required fields");
        }
    }

}
