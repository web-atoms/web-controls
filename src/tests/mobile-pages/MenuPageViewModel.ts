import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService.js";
import { AtomWindowViewModel } from "@web-atoms/core/dist/view-model/AtomWindowViewModel.js";
import ListPage from "./ListPage.js";

export default class MenuPageViewModel extends AtomWindowViewModel {

    @Inject
    public navigationService: NavigationService;

    public openListPage(): void {
        this.navigationService.openPage(ListPage, null, { target: "root"});
        this.close();
    }
}
