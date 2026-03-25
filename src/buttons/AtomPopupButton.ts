import { AtomPageLink } from "@web-atoms/core/dist/web/controls/AtomPageLink.js";
import { AtomPopupButtonStyle } from "./AtomPopupButtonStyle.js";

export default class AtomPopupButton extends AtomPageLink {

    public preCreate(): void {

        super.preCreate();

        this.defaultControlStyle = AtomPopupButtonStyle;
    }

}
