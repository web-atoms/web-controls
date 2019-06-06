import { BindableProperty } from "web-atoms-core/dist/core/BindableProperty";
import { NavigationService } from "web-atoms-core/dist/services/NavigationService";
import ReferenceService from "web-atoms-core/dist/services/ReferenceService";
import { AtomControl } from "web-atoms-core/dist/web/controls/AtomControl";

export default class AtomPopupButton extends AtomControl {

    @BindableProperty
    public popupTemplate: any = null;

    @BindableProperty
    public popupParameters: any = null;

    public preCreate(): void {
        super.preCreate();

        this.bindEvent(
            this.element,
            "click",
            () => this.openPopup());
    }

    protected openPopup(): Promise<void> {
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
            const c = rs.put(rs);
            path = `app://class/${c.key}`;
        }
        return navigationService.openPage(path, this.popupParameters);
    }

}
