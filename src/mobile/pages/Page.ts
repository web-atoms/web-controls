import { App } from "@web-atoms/core/dist/App";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";

export default class Page extends AtomControl {

    public static commandTemplate = XNode.prepare("commandTemplate", true, true);

    public static tasbTemplate = XNode.prepare("tabsTemplate", true, true);

    @BindableProperty
    public title: string = null;

    @BindableProperty
    public tag: string = null;

    @BindableProperty
    public commandTemplate: any;

    @BindableProperty
    public tabsTemplate: any;

    constructor(app: App, e?: HTMLElement) {
        super(app, e || document.createElement("div"));
    }

    public preCreate(): void {
        this.bind(this.element, "title", [["viewModel", "title"]]);
    }

}
