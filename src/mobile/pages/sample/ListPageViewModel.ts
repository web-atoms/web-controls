import { Inject } from "web-atoms-core/dist/di/Inject";
import { NavigationService } from "web-atoms-core/dist/services/NavigationService";
import { AtomViewModel } from "web-atoms-core/dist/view-model/AtomViewModel";
import DetailPage from "./DetailPage";

export default class ListPageViewModel extends AtomViewModel {

    @Inject
    public navigationService: NavigationService;

    public openFilter(): void {
        alert("Filter on List Page");
    }

    public openDetail() {
        this.navigationService.openPage(DetailPage, null, { target: "root"});
    }

}
