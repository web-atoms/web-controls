import { AtomUri } from "web-atoms-core/dist/core/AtomUri";
import { Inject } from "web-atoms-core/dist/di/Inject";
import { NavigationService } from "web-atoms-core/dist/services/NavigationService";
import { AtomViewModel, Receive } from "web-atoms-core/dist/view-model/AtomViewModel";

export default class PageFrameViewModel extends AtomViewModel {

    public owner: any = null;

    public canGoBack: boolean = false;

    public title: string = "Mobile Page";

    @Inject
    public navigationService: NavigationService;

    @Receive("root-page")
    public watchUrl(channel: string, data: string): void {
        if (!data) {
            return;
        }

        const url = new AtomUri(data);
        this.canGoBack = (url.query.canGoBack as boolean) || false;
        this.title = (url.query.title as string) || this.title;
        const ownerUrl = this.owner.url;
        if (this.canGoBack && ownerUrl) {
            // this.stack.push(ownerUrl);
            this.owner.keepStack = true;
        } else {
            this.owner.clearStack();
            this.owner.keepStack = false;
        }
        this.owner.url = data;
    }

    @Receive("root-page-go-back")
    public async iconClick(): Promise<void> {
        if (this.owner.keepStack && this.owner.stack.length) {
            this.owner.backCommand();
            this.canGoBack = this.owner.stack.length;
            return;
        }

        await this.navigationService.openPage(this.owner.menuUrl);
    }

}
