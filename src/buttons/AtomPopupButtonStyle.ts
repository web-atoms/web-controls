import Colors from "@web-atoms/core/dist/core/Colors";
import { AtomStyle } from "@web-atoms/core/dist/web/styles/AtomStyle";
import { IStyleDeclaration } from "@web-atoms/core/dist/web/styles/IStyleDeclaration";

export class AtomPopupButtonStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            padding: "5px",
            margin: "0 5px",
            background: "transparent",
            subclasses: {
                ".is-open": {
                    border: "1px solid gray",
                    padding: "4px",
                    backgroundColor: Colors.gray.withAlphaPercent(0.6)
                }
            }
        };
    }

}
