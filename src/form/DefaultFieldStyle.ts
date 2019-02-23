import Colors from "web-atoms-core/dist/core/Colors";
import { AtomStyle } from "web-atoms-core/dist/web/styles/AtomStyle";
import { IStyleDeclaration } from "web-atoms-core/dist/web/styles/IStyleDeclaration";

export default class DefaultFieldStyle extends AtomStyle {
    public get root(): IStyleDeclaration {
        return {
            subclasses: {
                ".has-error": {
                    backgroundColor: Colors.red.withAlphaPercent(0.1)
                },
                " > .help": {
                    marginLeft: "5px",
                    borderRadius: "50%",
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    padding: "3px",
                    textAlign: "center",
                    color: Colors.white,
                    backgroundColor: Colors.limeGreen,
                    cursor: "pointer",
                    fontSize: "70%"
                },
                " > .label": {
                    fontSize: "70%"
                },
                " > .required": {
                    fontSize: "70%",
                    color: Colors.red
                },
                " > .presenter": {
                    display: "block",
                    clear: "both"
                },
                " > .error": {
                    display: "block",
                    clear: "both",
                    color: Colors.red
                }
            }
        };
    }
}
