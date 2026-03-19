import { App } from "@web-atoms/core/dist/App.js";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";

export default class Page extends AtomControl {

    public static commandTemplate = XNode.prepare("commandTemplate", true, true);

    public static tabsTemplate = XNode.prepare("tabsTemplate", true, true);

    public title: string;

    public tag: string;

    public commandTemplate: any;

    public tabsTemplate: any;

    public preCreate(): void {
        this.title = null;
        this.tag = null;
        this.commandTemplate = null;
        this.tabsTemplate = null;
        this.bind(this.element, "title", [["viewModel", "title"]]);
    }

}
