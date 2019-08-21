import { BindableProperty } from "web-atoms-core/dist/core/BindableProperty";
import { CancelToken } from "web-atoms-core/dist/core/types";
import { NavigationService } from "web-atoms-core/dist/services/NavigationService";
import ReferenceService from "web-atoms-core/dist/services/ReferenceService";
import { AtomControl } from "web-atoms-core/dist/web/controls/AtomControl";

export default class AtomPopupButton extends AtomControl {

    @BindableProperty
    public isOpen: boolean = false;

    @BindableProperty
    public popupTemplate: any = null;

    @BindableProperty
    public popupParameters: any = null;

    private cancelToken: CancelToken = null;

    public preCreate(): void {
        super.preCreate();

        this.bindEvent(
            this.element,
            "click",
            () => this.app.runAsync(() => this.openPopup()));
    }

    protected async openPopup(): Promise<void> {

        if (this.cancelToken) {
            this.cancelToken.cancel();
            this.cancelToken = null;
            return;
        }

        this.cancelToken = new CancelToken();

        try {
            const navigationService = this.app.resolve(NavigationService) as NavigationService;
            const pt = this.popupTemplate;
            if (!pt) {
                // tslint:disable-next-line:no-console
                console.error("No popup template specified in PopupButton");
                return;
            }
            let path: string;
            if (typeof pt === "string") {
                path = pt;
            } else {
                const rs = this.app.resolve(ReferenceService) as ReferenceService;
                const c = rs.put(pt);
                path = `app://class/${c.key}`;
            }
            this.isOpen = true;
            const result = await navigationService.openPage(path, this.popupParameters, {
                cancelToken: this.cancelToken
            });

            this.element.dispatchEvent(new CustomEvent("result", { detail: result }));

        } finally {
            this.isOpen = false;
        }
    }

}
