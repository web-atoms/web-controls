import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import AtomRepeater from "./AtomRepeater";

import "./styles/list-repeater-style";
export default class ListRepeater<T = any> extends AtomRepeater<T> {

    public get autoSelectOnClick(): boolean {
        return this.selectOnClick;
    }
    public set autoSelectOnClick(value: boolean) {
        this.selectOnClick = value;
    }

    protected preCreate() {
        super.preCreate();
        this.autoSelectOnClick = true;
        this.element.setAttribute("data-list-repeater", "list-repeater");
    }

}
