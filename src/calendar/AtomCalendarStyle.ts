import Colors from "web-atoms-core/dist/core/Colors";
import { AtomStyle } from "web-atoms-core/dist/web/styles/AtomStyle";
import { AtomTheme } from "web-atoms-core/dist/web/styles/AtomTheme";
import { IStyleDeclaration } from "web-atoms-core/dist/web/styles/IStyleDeclaration";

export default class AtomCalendarStyle extends AtomStyle {

    public get theme(): AtomTheme {
        return this.styleSheet as AtomTheme;
    }

    public get root(): IStyleDeclaration {

        const existing = this.calendarContainer;

        return {
            ... existing,
            subclasses: {
                ... existing.subclasses,
                " .disabled ": {
                    textDecoration: "line-through"
                },
                " .week-days": {
                    subclasses: {
                        " > div": {
                            display: "inline-block",
                            border: "none",
                            color: Colors.black,
                            fontWeight: "bold",
                            fontSize: "75%",
                            textAlign: "center",
                            borderRadius : 0,
                            backgroundColor: Colors.rgba(232, 232, 232),
                            width : "calc(100%/7)",
                            paddingTop: "1%",
                            paddingBottom: "1%"
                        }
                    }
                },
                " .month-days": {
                    marginTop: "0.5%",
                    marginBottom: "0.5%",
                    subclasses: {
                        " > div" : {
                            width: "calc(100%/7)",
                            minHeight: "28px",
                            display: "inline-block",
                            borderRadius: "50%",
                            backgroundColor: Colors.white,
                            cursor: "default",
                            color: Colors.black,
                            subclasses: {
                            " > div": {
                                borderRadius: "50%",
                                width: "61%",
                                display: "block",
                                padding: "7%",
                                paddingLeft: "2%",
                                paddingRight: "2%",
                                subclasses: {
                                    ".date-css": {
                                        display: "inline-block",
                                        fontSize: "75%",
                                        textAlign: "center"
                                    },
                                    ".is-today": {
                                        fontWeight: "bold",
                                        color: Colors.rgba(27, 177, 177),
                                    },
                                    ".is-weekend": {
                                        color: "#a50000",
                                    },
                                    ".shoot": {
                                        backgroundColor: "#093",
                                        ...this.typeStyle
                                    },
                                    ".audition": {
                                        backgroundColor: "#6f6ffb",
                                        ...this.typeStyle
                                    },
                                    ".option": {
                                        backgroundColor: "#3bc3c3",
                                        ...this.typeStyle
                                    },
                                    ".callback": {
                                        backgroundColor: "#ffa401",
                                        ...this.typeStyle
                                    },
                                    ".test-shoot": {
                                        backgroundColor: "#ff96aa",
                                        ...this.typeStyle
                                    },
                                    ".personal": {
                                        backgroundColor: "#fab5be",
                                        ...this.typeStyle
                                    },
                                    ".go-see": {
                                        backgroundColor: "#fab0fb",
                                        ...this.typeStyle
                                    },
                                    ".training": {
                                        backgroundColor: "#d1cebc",
                                        ...this.typeStyle
                                    },
                                    ".wardrobe": {
                                        backgroundColor: "#bbdf49",
                                        ...this.typeStyle
                                    },
                                    ".rehearsal": {
                                        backgroundColor: "#39f",
                                        ...this.typeStyle
                                    },
                                    ".travel": {
                                        backgroundColor: "#c7894b",
                                        ...this.typeStyle
                                    },
                                    ".is-other-month": {
                                        color: Colors.gray
                                    },
                                    ".is-selected": {
                                        border: "1px solid",
                                        borderColor: Colors.gray,
                                        fontWeight: "bold",
                                        backgroundColor: Colors.white,
                                        color: Colors.rgba(185, 149, 93),
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}

    public get typeStyle(): IStyleDeclaration {
    return {
        color: "#fff",
        padding: "10%",
        paddingLeft: "0",
        paddingRight: "0"
            };
        }
    public get calendarContainer(): IStyleDeclaration {
        return {
            minWidth: "305px",
            textAlign: "center",
            fontFamily: "'Muli', sans-serif",
            boxSizing: "content-box",
            border: "1px solid",
            borderColor: Colors.rgba(232, 232, 232),
            subclasses: {
                " .header": {
                    textAlign: "center",
                    padding: "1%",
                    subclasses: {
                        " > span": {
                            display: "inline-block",
                            marginTop: "1%",
                            padding: "3%",
                            width: "4%",
                            background: "transparent no-repeat",
                        },
                        " .previous-btn": {
                            marginLeft: "3%",
                            float: "left"
                        },
                        " .next-btn": {
                            marginRight: "3%",
                            float: "right"
                        },
                        " > select": {
                            padding: "1%",
                            lineHeight: "1.4",
                            fontSize: "95%",
                            color: Colors.rgba(185, 149, 93),
                            border: "none",
                            fontWeight: "600"
                        }
                    }
                }
            }
        };
    }
}
