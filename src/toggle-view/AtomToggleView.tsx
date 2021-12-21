import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

export interface IToggleView {
    label?: string;
    icon?: string;
}

const translate = (n: number) => `( -${n * 100} 0)`;

export function ToggleView(
    {
        icon,
        label
    }: IToggleView,
    node: XNode) {
    return <div>
        <div>
            <label text={label}/>
        </div>
        <div>
            {node}
        </div>
    </div>;
}

const css = CSS(StyleRule()
    .verticalFlexLayout()
    .child(StyleRule(".toolbar")
        .flexLayout({ gap: 0})
    )
    .child(StyleRule(".presenter")
        .flexStretch()
    )
);

export default class AtomToggleView extends AtomControl {

    @BindableProperty
    public selectedIndex: number;

    protected preCreate(): void {
        this.selectedIndex = 0;
    }

    protected render(node: XNode, e?: any, creator?: any): void {
        this.render = super.render;

        super.render(<div class={css} { ... node.attributes}>
            <div class="toolbar"></div>
            <div class="presenter"></div>
        </div>);

        const toolbar = this.element.getElementsByClassName("toolbar")[0];
        const presenter = this.element.getElementsByClassName("presenter")[0];

        let index = 0;
        for (const iterator of node.children) {
            const { 0: label, 1: view} = iterator.children;
            const i = index++;
            label.attributes ??= {};
            view.attributes ??= {};
            label.attributes.eventClick = Bind.event(() => this.selectedIndex = i);
            label.attributes.styleClass = Bind.oneWay(() => ({
                item: 1,
                selected: i === this.selectedIndex
            }) );
            view.attributes.styleTransform = Bind.oneWay(() => i !== this.selectedIndex
                ? translate(index)
                : "" );
            this.render(label, toolbar, this);
            this.render(view, presenter, this);
            index++;
        }
    }

}
