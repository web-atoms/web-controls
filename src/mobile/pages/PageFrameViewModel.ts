import { Atom } from "@web-atoms/core/dist/Atom";
import { AtomBinder } from "@web-atoms/core/dist/core/AtomBinder";
import { AtomUri } from "@web-atoms/core/dist/core/AtomUri";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import { Inject } from "@web-atoms/core/dist/di/Inject";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import { AtomViewModel, Receive, Watch } from "@web-atoms/core/dist/view-model/AtomViewModel";
import bindUrlParameter from "@web-atoms/core/dist/view-model/bindUrlParameter";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";

declare var dotNet: any;

export default class PageFrameViewModel extends AtomViewModel {

    public owner: any = null;

    @Watch
    public get canGoBack(): boolean {
        if (!this.owner) {
            return false;
        }
        return this.owner.stack.length > 0;
    }

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

        if  (this.app.url.hash.url !== value) {
            this.app.url.hash.url = value;
            history.pushState({}, document.title, this.app.url.toString());
        }

        this.refresh("url");
    }

    public async init(): Promise<void> {
        await Atom.delay(1);
        if (!this.owner.name) {
            return;
        }
        // bindUrlParameter(this, "url", this.owner.name);

        if (this.owner.url) {
            this.app.url.hash.url = this.owner.url;
            this.mUrl = this.owner.url;
            history.pushState({}, document.title, this.app.url.toString());
        } else {
            const url = this.app.url ? (this.app.url.query.url  || this.app.url.query.url) : null;
            if (url) {
                this.url = url.toString();
            }
        }

        // watch for window popstate...

        if (typeof dotNet === "undefined") {
            (this.owner as AtomControl).bindEvent(
                window as any,
                "popstate",
                () => this.onPopState());
        } else {
            window.addEventListener("backButton", (ce: CustomEvent<Function>) => {
                const { detail } = ce;
                ce.preventDefault();
                this.app.runAsync(async () => {
                    if (this.owner.stack.length) {
                        await this.iconClick();
                    } else {
                        detail();
                    }
                });
            });
        }
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
                // this.canGoBack = this.owner.stack.length;
                AtomBinder.refreshValue(this, "canGoBack");
            }, 500);
            return;
        }

        if (!this.owner.menuUrl) {
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

    private onPopState() {
        // do nothing if the top is same...

        this.app.url = new AtomUri(location.href);
        const url = this.app.url.hash.url || this.app.url.query.url;
        if (url === this.mUrl) {
            return;
        }

        const stack = this.owner.stack;
        if (stack.length && stack[stack.length - 1].url === url) {
            this.owner.backCommand();
            return;
        }

        this.owner.url = url;
    }

}
