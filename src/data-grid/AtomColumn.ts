import { BindableProperty } from "web-atoms-core/dist/core/BindableProperty";
import { AtomControl } from "web-atoms-core/dist/web/controls/AtomControl";

export default class AtomColumn extends AtomControl {

    @BindableProperty
    public label: string;

}
