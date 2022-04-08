import Colors from "@web-atoms/core/dist/core/Colors";
import StyleRule, { AtomStyleRules } from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

function fromCamelToHyphen(input: string): string {
    return input.replace( /([a-z])([A-Z])/g, "$1-$2" ).toLowerCase();
}

let style = StyleRule();

function registerDataStyle(name, fx: (s: AtomStyleRules) => AtomStyleRules) {
    const className = `.${name}`;
    style = style.nested(fx(StyleRule(className)));
    const dataName = `data-${fromCamelToHyphen(name)}`;
    style = style.nested(fx(StyleRule(`*[${dataName}]`)));
    return {
        [dataName]: "1",
        toString() {
            return name;
        }
    };
}

const InBuiltStyles = {
    colors: {
        red: registerDataStyle("color-red", (x) => x.color(Colors.red)),
        yellow: registerDataStyle("color-yellow", (x) => x.color(Colors.yellow)),
        green: registerDataStyle("color-green", (x) => x.color(Colors.green)),
        lightGreen: registerDataStyle("color-light-green", (x) => x.color(Colors.lightGreen))
    },
    rotate: {
        animate: {
            d180: registerDataStyle("rotate-animate-d180", (x) => x.transform("rotate(-180deg)" as any).transition("transform 150ms ease")),
            d0: registerDataStyle("rotate-animate-d0", (x) => x.transform("rotate(0deg)" as any).transition("transform 150ms ease")),
        }
    }
}

CSS(style, "body");

export default InBuiltStyles;
