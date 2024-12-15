import XNode from "@web-atoms/core/dist/core/XNode";

import "./Button.local.less";

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

const css = "web-atoms-button";
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

    console.warn("Deprecated, use data-layout=icon-button")

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
