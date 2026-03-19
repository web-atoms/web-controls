import { Inject } from "@web-atoms/core/dist/di/Inject.js";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService.js";
import { AtomViewModel } from "@web-atoms/core/dist/view-model/AtomViewModel.js";
import DetailPage from "./DetailPage.js";

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
