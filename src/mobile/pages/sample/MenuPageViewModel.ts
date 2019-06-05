import { Inject } from "web-atoms-core/dist/di/Inject";
import { NavigationService } from "web-atoms-core/dist/services/NavigationService";
import { AtomWindowViewModel } from "web-atoms-core/dist/view-model/AtomWindowViewModel";

export default class MenuPageViewModel extends AtomWindowViewModel {

    @Inject
    public navigationService: NavigationService;

    public openListPage(): void {
        this.app.broadcast("root-page", "@web-atoms/web-controls/dist/mobile/pages/sample/ListPage");
        this.close();
    }
}
