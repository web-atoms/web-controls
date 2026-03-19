import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty.js";
import { CancelToken } from "@web-atoms/core/dist/core/types.js";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService.js";
import ReferenceService from "@web-atoms/core/dist/services/ReferenceService.js";
import { AtomPageLink } from "@web-atoms/core/dist/web/controls/AtomPageLink.js";
import { AtomPopupButtonStyle } from "./AtomPopupButtonStyle.js";

export default class AtomPopupButton extends AtomPageLink {

    public preCreate(): void {

        super.preCreate();

        this.defaultControlStyle = AtomPopupButtonStyle;
    }

}
