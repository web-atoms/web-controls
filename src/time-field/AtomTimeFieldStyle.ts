import { AtomStyle } from "@web-atoms/core/dist/web/styles/AtomStyle.js";
import { IStyleDeclaration } from "@web-atoms/core/dist/web/styles/IStyleDeclaration.js";

export default class AtomTimeFieldStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            subclasses: {
                " .minutes": {
                    maxWidth: "50px"
                },
                " .hour": {
                    maxWidth: "50px"
                }
            }
        };
    }
}
