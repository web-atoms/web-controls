import { BindableProperty } from "web-atoms-core/dist/core/BindableProperty";
import { NavigationService } from "web-atoms-core/dist/services/NavigationService";
import ReferenceService from "web-atoms-core/dist/services/ReferenceService";
import { AtomControl } from "web-atoms-core/dist/web/controls/AtomControl";

export default class PopupButton extends AtomControl {

    @BindableProperty
    public popupTemplate: any;

    public preCreate(): void {
        super.preCreate();

        const navigationService = this.app.resolve(NavigationService) as NavigationService;
        const rs = this.app.resolve(ReferenceService) as ReferenceService;
        const c = rs.put(rs);
        const path = `app://class/${c.key}`;
        this.bindEvent(
            this.element,
            "click",
            () => navigationService.openPage(path));
    }

}
