import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

export interface IButton {
    id?: string;
    icon?: string;
    text?: string;
    eventClick?: any;
    href?: string;
    target?: string;
    title?: string;
    styleDisplay?: string;
    class?: string;
    isVisible?: any;
    subClass?: string;
}

const css = CSS(
    StyleRule()
    .padding(8)
    .marginLeft(3)
    .marginRight(3)
    .roundBorderFull()
    .display("inline-block")
    .height(40)
    .minWidth(40)
    .defaultBoxShadow()
    .cursor("pointer")
    .backgroundColor(Colors.transparent)
    .hoverBackgroundColor(Colors.lightGreen)
    .and(StyleRule(".pressed")
        .backgroundColor(Colors.lightSteelBlue)
    )
    .child(StyleRule("label.label")
        .display("flex")
        .alignItems("center")
        .gap("5px")
        .child(StyleRule(".fad")
            .fontSize(18)
            .width("100%")
            .color(Colors.purple.withAlphaPercent(0.5))
            .cursor("pointer")
            .and(StyleRule(".red")
                .color(Colors.red)
            )
        )
        .child(StyleRule("span")
            .whiteSpace("nowrap")
        )
    )
);

export default function Button({
    id,
    icon,
    text,
    eventClick,
    href,
    target,
    title,
    styleDisplay,
    class: className,
    subClass
}: IButton) {

    const cn = className ?? ( subClass
        ? subClass + " " + css
        : css
    );

    if (href) {

        if (text) {
            return <a id={id}
                class={cn}
                target={target}
                title={title}
                styleDisplay={styleDisplay}
                >
                <label class="label">
                    <i class={icon}/>
                    { text && <span text={text}/> }
                </label>
            </a>;
        }
    }
    return <button id={id} class={cn} eventClick={eventClick} title={title} styleDisplay={styleDisplay}>
            <label class="label">
                <i class={icon}/>
                { text && <span text={text}/> }
            </label>
        </button>;
}

Button.className = css;
