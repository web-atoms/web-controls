import { BindableProperty } from "web-atoms-core/dist/core/BindableProperty";
import { AtomControl } from "web-atoms-core/dist/web/controls/AtomControl";

export default class Page extends AtomControl {

    @BindableProperty
    public title: string = null;

    @BindableProperty
    public tag: string = null;

    @BindableProperty
    public commandTemplate: any;

    public preCreate(): void {
        this.bind(this.element, "title", [["viewModel", "title"]]);
    }

}
