import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import ReferenceService from "@web-atoms/core/dist/services/ReferenceService";
import { AtomPageLink } from "@web-atoms/core/dist/web/controls/AtomPageLink";
import { AtomPopupButtonStyle } from "./AtomPopupButtonStyle";

export default class AtomPopupButton extends AtomPageLink {

    public preCreate(): void {

        super.preCreate();

        this.defaultControlStyle = AtomPopupButtonStyle;
    }

}
