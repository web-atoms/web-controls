import { Atom } from "web-atoms-core/dist/Atom";
import { AtomUri } from "web-atoms-core/dist/core/AtomUri";
import { CancelToken } from "web-atoms-core/dist/core/types";
import { Inject } from "web-atoms-core/dist/di/Inject";
import { NavigationService } from "web-atoms-core/dist/services/NavigationService";
import { AtomViewModel, Receive } from "web-atoms-core/dist/view-model/AtomViewModel";
import bindUrlParameter from "web-atoms-core/dist/view-model/bindUrlParameter";

export default class PageFrameViewModel extends AtomViewModel {

    public owner: any = null;

    public canGoBack: boolean = false;

    public title: string = "Mobile Page";

    @Inject
    public navigationService: NavigationService;

    public cancelToken: CancelToken;

    private mUrl: string;
    public get url(): string {
        return this.mUrl;
    }
    public set url(value: string) {
        if (value === this.mUrl) {
            return;
        }
        this.mUrl = value;
        this.owner.pushUrl(value);
        this.refresh("url");
    }

    public async init(): Promise<void> {
        if (!this.owner.name) {
            return;
        }
        bindUrlParameter(this, "url", this.owner.name);
    }

    @Receive("root-page-go-back")
    public async iconClick(): Promise<void> {

        if (this.cancelToken) {
            this.cancelToken.cancel();
            this.cancelToken = null;
            return;
        }

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

        this.cancelToken = new CancelToken();

        // not awaiting on this promise because
        // button click will not work till the promise
        // finishes
        this.navigationService.openPage(this.owner.menuUrl, null, { cancelToken: this.cancelToken })
            .then(() => this.cancelToken = null)
            .catch(() => this.cancelToken = null);
    }

}
