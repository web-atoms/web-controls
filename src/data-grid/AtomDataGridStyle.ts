import Colors from "@web-atoms/core/dist/core/Colors";
import { AtomStyle } from "@web-atoms/core/dist/web/styles/AtomStyle";
import { IStyleDeclaration } from "@web-atoms/core/dist/web/styles/IStyleDeclaration";

export default class AtomDataGridStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            overflow: "auto",
            subclasses: {
                " > table > thead": {
                    subclasses: {
                        " > tr": {
                            backgroundColor: Colors.lightGrey
                        },
                        " > tr > th": {
                            padding: "5px"
                        }
                    }
                },
                " > table > tbody": {
                    subclasses: {
                        " > tr": {
                            backgroundColor: Colors.white
                        },
                        " > tr:hover": {
                            backgroundColor: Colors.lightGreen
                        },
                        " > tr > td": {
                            padding: "5px"
                        },
                        " > tr > td:hover": {
                            backgroundColor: Colors.lightSeaGreen
                        }
                    }
                }
            }
        };
    }
}
