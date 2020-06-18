import Colors from "@web-atoms/core/dist/core/Colors";
import { AtomStyle } from "@web-atoms/core/dist/web/styles/AtomStyle";
import { IStyleDeclaration } from "@web-atoms/core/dist/web/styles/IStyleDeclaration";

export default class AtomSwitchStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            marginLeft: "5px",
            marginRight: "5px",
            subclasses: {
                ".switch": this.switch,
                " .slider": this.slider
            }
        };
    }

    public get switch(): IStyleDeclaration {
        return {
            position: "relative",
            display: "inline-block",
            width: "60px",
            height: "34px",
            subclasses: {
                " input": {
                    opacity: "0",
                    width: "0",
                    height: "0",
                    subclasses: {
                        ":checked + .slider": {
                            backgroundColor: Colors.deepSkyBlue
                        },
                        ":checked + .slider:before": {
                            transform: "translateX(26px)"
                        },
                        ":focus + .slider": {
                            boxShadow: "0 0 1px " + Colors.deepSkyBlue
                        }
                    }
                }
            }
        };
    }

    public get slider(): IStyleDeclaration {
        return {
            position: "absolute",
            cursor: "pointer",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: Colors.silver,
            transition: ".4s",
            borderRadius: "20px",
            subclasses: {
                ":before": {
                    position: "absolute",
                    content: '""',
                    height: "26px",
                    width: "26px",
                    left: "4px",
                    bottom: "4px",
                    backgroundColor: Colors.white,
                    transition: ".4s",
                    borderRadius: "50%"
                }
            }
        };
    }
}
