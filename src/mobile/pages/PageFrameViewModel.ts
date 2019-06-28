import { AtomUri } from "web-atoms-core/dist/core/AtomUri";
import { Inject } from "web-atoms-core/dist/di/Inject";
import { NavigationService } from "web-atoms-core/dist/services/NavigationService";
import { AtomViewModel, Receive } from "web-atoms-core/dist/view-model/AtomViewModel";

export default class PageFrameViewModel extends AtomViewModel {

    public owner: any = null;

    public pageFrame: any;

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
            if (this.pageFrame) {
                this.pageFrame.keepStack = true;
            }
        } else {
            if (this.pageFrame) {
                this.pageFrame.clearStack();
                this.pageFrame.keepStack = false;
            }
        }
        this.owner.url = data;
    }

    @Receive("root-page-go-back")
    public async iconClick(): Promise<void> {
        if (this.pageFrame) {
            if (this.pageFrame.keepStack && this.pageFrame.stack.length) {
                this.pageFrame.backCommand();
                return;
            }
        }

        await this.navigationService.openPage(this.owner.menuUrl);
    }

}
