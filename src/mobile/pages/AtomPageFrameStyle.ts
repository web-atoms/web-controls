import Colors from "web-atoms-core/dist/core/Colors";
import AtomFrameStyle from "web-atoms-core/dist/web/styles/AtomFrameStyle";
import { AtomStyle } from "web-atoms-core/dist/web/styles/AtomStyle";
import { IStyleDeclaration } from "web-atoms-core/dist/web/styles/IStyleDeclaration";

export default class AtomPageFrameStyle extends AtomStyle {

    public init(): void {
        this.registerExternalStyleSheet({
            href: "https://use.fontawesome.com/releases/v5.8.1/css/all.css",
            crossOrigin: "anonymous",
            integrity: "sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
        });
    }

    public get root(): IStyleDeclaration {
        return {
            subclasses: {
                " .title-bar": {

                    backgroundColor: Colors.lightSeaGreen,

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
