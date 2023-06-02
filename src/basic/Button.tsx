import XNode from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";

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

const css = styled.css `
    padding: 8px;
    margin-left: 3px;
    margin-right: 3px;
    border-radius: 9999px;
    display: inline-block;
    height: 40px;
    min-width: 40px;
    box-shadow: rgba(50, 50, 105, 0.07) 0px 2px 5px 0px, rgba(0, 0, 0, 0.03) 0px 1px 1px 0px;
    border: solid 1px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    background-color: transparent;
    &.pressed {
        background-color: lightsteelblue;
    }
    &:hover {
        background-color: lightgreen;
    }
    & > label.label {
        display: flex;
        align-items: center;
        gap: 5px;
        & > .fad {
            font-size: larger;
            width: 100%;
            color: purple;
            cursor: pointer;
            &.red {
                color: red;
            }
        }
        & > span {
            white-space: nowrap;
        }
    }
`.installLocal();
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
