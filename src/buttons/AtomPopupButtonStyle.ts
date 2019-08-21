import Colors from "web-atoms-core/dist/core/Colors";
import { AtomStyle } from "web-atoms-core/dist/web/styles/AtomStyle";
import { IStyleDeclaration } from "web-atoms-core/dist/web/styles/IStyleDeclaration";

export class AtomPopupButtonStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            padding: "5px",
            subclasses: {
                ":hover": {
                    backgroundColor: Colors.gray.withAlphaPercent(0.4)
                },
                ".is-open": {
                    border: "1px solid gray",
                    backgroundColor: Colors.gray.withAlphaPercent(0.6)
                }
            }
        };
    }

}
