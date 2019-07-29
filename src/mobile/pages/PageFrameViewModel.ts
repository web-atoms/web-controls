import { AtomUri } from "web-atoms-core/dist/core/AtomUri";
import { CancelToken } from "web-atoms-core/dist/core/types";
import { Inject } from "web-atoms-core/dist/di/Inject";
import { NavigationService } from "web-atoms-core/dist/services/NavigationService";
import { AtomViewModel, Receive } from "web-atoms-core/dist/view-model/AtomViewModel";

export default class PageFrameViewModel extends AtomViewModel {

    public owner: any = null;

    public canGoBack: boolean = false;

    public title: string = "Mobile Page";

    @Inject
    public navigationService: NavigationService;

    public cancelToken: CancelToken;

    @Receive("root-page-go-back")
    public async iconClick(): Promise<void> {
        if (this.owner.keepStack && this.owner.stack.length) {
            const p = this.owner.backCommand();
            if (p && p.then && p.catch) {
                await p;
            }
            setTimeout(() => {
                this.canGoBack = this.owner.stack.length;
            }, 500);
            return;
        }

        if (this.cancelToken) {
            this.cancelToken.cancel();
            return;
        }

        this.cancelToken = new CancelToken();
        await this.navigationService.openPage(this.owner.menuUrl, null, { cancelToken: this.cancelToken });
    }

}
