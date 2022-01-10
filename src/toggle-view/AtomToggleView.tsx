import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

export interface IToggleView {
    label?: string;
    icon?: string;
}

export function ToggleView(
    {
        icon,
        label
    }: IToggleView,
    node: XNode) {
    return <div>
        <div>
            <i class={icon}/>
            <label text={label}/>
        </div>
        <div>
            {node}
        </div>
    </div>;
}

const css = CSS(StyleRule()
    .flexStretch()
    .verticalFlexLayout({ alignItems: "stretch"})
    .overflow("hidden")
    .child(StyleRule(".toolbar")
        .flexLayout({ gap: 0})
        .alignSelf("center")
        .child(StyleRule(".item")
            .flexLayout({ inline: true })
            .border("solid 1px lightgray")
            .padding(5)
            .child(StyleRule("label")
                .whiteSpace("nowrap")
                .marginBottom(0)
            )
            .and(StyleRule(".selected")
                .backgroundColor(Colors.darkBlue)
                .color(Colors.white)
            )
            .and(StyleRule(":first-child")
                .borderTopLeftRadius(10)
                .borderBottomLeftRadius(10)
            ).and(StyleRule(":last-child")
                .borderTopRightRadius(10)
                .borderBottomRightRadius(10)
            )
        )
    )
    .child(StyleRule(".presenter")
        .flexStretch()
        .verticalFlexLayout({ alignItems: "stretch"})
        .overflow("hidden")
        .child(StyleRule("*")
            .flexStretch()
            .transition("transform 0.3s")
            .overflow("auto")
            .padding(5)
        )
        .child(StyleRule(".left")
            .transform("translate(-100%, 0)" as any)
        )
        .child(StyleRule(".right")
            .transform("translate(100%, 0)" as any)
        )
        .child(StyleRule(".selected")
            .transform("translate(0, 0)" as any)
        )
    )
, "div[data-wa-toggle-view=wa-toggle-view]");

export default class AtomToggleView extends AtomControl {

    @BindableProperty
    public selectedIndex: number;

    protected preCreate(): void {
        this.selectedIndex = 0;
    }

    protected render(node: XNode, e?: any, creator?: any): void {
        this.render = super.render;

        super.render(<div
            data-wa-toggle-view="wa-toggle-view"
            { ... node.attributes}>
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
            view.attributes.styleClass = Bind.oneWay(() => ({
                left: i < this.selectedIndex,
                right: i > this.selectedIndex,
                selected: i === this.selectedIndex
            }));
            const l = document.createElement("div");
            toolbar.appendChild(l);
            this.render(label, l, this);
            const p = document.createElement("div");
            presenter.appendChild(p);
            this.render(view, p, this);
            index++;
        }
    }

}
