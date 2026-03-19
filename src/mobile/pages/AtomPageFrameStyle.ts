import Colors from "@web-atoms/core/dist/core/Colors.js";
import AtomFrameStyle from "@web-atoms/core/dist/web/styles/AtomFrameStyle.js";
import { AtomStyle } from "@web-atoms/core/dist/web/styles/AtomStyle.js";
import { IStyleDeclaration } from "@web-atoms/core/dist/web/styles/IStyleDeclaration.js";

export default class AtomPageFrameStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            subclasses: {
                " .title-bar": {

                    backgroundColor: Colors.lightSeaGreen,
                    position: "fixed",
                    left: 0,
                    top: 0,
                    right: 0,

                    padding: "4px",
                    subclasses: {
                        " .icon": {
                            display: "inline-block",
                            marginRight: "4px"
                        },
                        " .title": {
                            display: "inline-block"
                        },
                        " .commands": {
                            display: "inline-block",
                            float: "right"
                        }
                    }
                },

                " .page-presenter": {
                    marginTop: "25px"
                },

                " .tabs": {
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0
                }
            }
        };
    }

}

export class FrameStyle extends AtomFrameStyle {

    public get root(): IStyleDeclaration {
        return {};
    }

}
