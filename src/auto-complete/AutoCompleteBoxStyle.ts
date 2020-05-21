import { AtomStyle } from "@web-atoms/core/dist/web/styles/AtomStyle";
import { AtomTheme } from "@web-atoms/core/dist/web/styles/AtomTheme";
import { IStyleDeclaration } from "@web-atoms/core/dist/web/styles/IStyleDeclaration";
import StyleBuilder from "@web-atoms/core/dist/web/styles/StyleBuilder";

export default class AutoCompleteBoxStyle extends AtomStyle {

    public get theme(): AtomTheme {
        return this.styleSheet as AtomTheme;
    }

    public get root(): IStyleDeclaration {
        return {
            position: "relative",
            minWidth: "200px",
            minHeight: "25px",
            borderRadius: "3px",
            webkitBorderRadius: "3px",
            subclasses: {
                ".popup": this.popup,
                " .item": this.item,
                " .selected-item": this.selectedItem,
                " .item-template": this.itemTemplate,
                " > input[type=search]": {
                    ... StyleBuilder.newStyle.absolute(0, 0).toStyle(),
                    opacity: "0",
                    zIndex: "100",
                    borderRadius: "3px",
                    webkitBorderRadius: "3px",
                    subclasses: {
                        ":focus": {
                            // opacity: "1"
                        }
                    }
                },
                " > div": {
                    zIndex: "1"
                },
                ".popup-open": {
                    borderRadius: "3px",
                    webkitBorderRadius: "3px",
                    subclasses: {
                        " > input[type=search]": {
                            opacity: "1",
                            borderRadius: "3px",
                            webkitBorderRadius: "3px",
                            webkitAppearance: "none",
                        },
                        " > div": {
                            opacity: "0.3"
                        }
                    }
                }
            }
        };
    }

    public get popup(): IStyleDeclaration {
        return {
            overflow: "auto",
            width: "200px",
            height: "400px"
        };
    }

    public get itemTemplate(): IStyleDeclaration {
        return {
            ... StyleBuilder
                .newStyle
                .absolute(0, 0)
                .toStyle(),
            ... this.item
        };
    }

    public get item(): IStyleDeclaration {
        return {
            backgroundColor: this.theme.bgColor,
            color: this.theme.color,
            padding: "5px",
            borderRadius: "5px"
        };
    }

    public get selectedItem(): IStyleDeclaration {
        return {
            ... this.item,
            backgroundColor: this.theme.selectedBgColor,
            color: this.theme.selectedColor
        };
    }

}
