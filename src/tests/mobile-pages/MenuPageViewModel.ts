import { Inject } from "@web-atoms/core/dist/di/Inject";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import { AtomWindowViewModel } from "@web-atoms/core/dist/view-model/AtomWindowViewModel";
import ListPage from "./ListPage";

export default class MenuPageViewModel extends AtomWindowViewModel {

    @Inject
    public navigationService: NavigationService;

    public openListPage(): void {
        this.navigationService.openPage(ListPage, null, { target: "root"});
        this.close();
    }
}
