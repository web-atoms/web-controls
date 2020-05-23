import { Atom } from "@web-atoms/core/dist/Atom";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import { CancelToken, IClassOf } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import ReferenceService from "@web-atoms/core/dist/services/ReferenceService";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { AtomTemplateControl } from "@web-atoms/core/dist/web/controls/AtomTemplateControl";
import { WindowService } from "@web-atoms/core/dist/web/services/WindowService";
import AppComboBoxViewModel from "./AppComboBoxViewModel";
import AutoCompleteBoxStyle from "./AutoCompleteBoxStyle";
import ItemHost from "./ItemHost";

export interface IFetchEvent {
    search?: string;
    value?: any;
    cancel?: CancelToken;
}

enum KeyCodes {
    Enter = "Enter",
    ArrowDown = "ArrowDown",
    ArrowUp = "ArrowUp",
    ArrowLeft = "ArrowLeft",
    ArrowRight = "ArrowRight",
    End = "End",
    Home = "Home",
    Escape = "Escape"
}

export default class AutoCompleteBox extends AtomControl {

    public static itemTemplate = XNode.prepare("itemTemplate", true, true);

    public itemTemplate: IClassOf<AtomControl>;

    @BindableProperty
    public selectedItem: any;

    public previousItem: any;

    @BindableProperty
    public value: any;

    /**
     * Label is displayed in place holder
     * @type {*}
     * @memberof AutoCompleteBox
     */
    public label: any;

    public items: any[];

    public itemsSource: (fetchEvent: IFetchEvent) => Promise<any[]> | any[];

    public valueFunc: ((item: any) => any);

    public itemHostTemplate: IClassOf<AtomControl>;

    public searchText: string;

    public isPopupOpen: boolean;

    private lastSearchText: string;

    private lastValue: any;

    private cancelToken: CancelToken;

    private windowViewModel: AppComboBoxViewModel;

    private created: boolean;

    private isUpdating: boolean;

    public onPropertyChanged(name: string): void {
        switch (name) {
            case "searchText":
            case "value":
                this.onSearchTextChanged(true);
                break;
            case "selectedItem":
                const si = this.selectedItem;
                const vf = this.valueFunc;
                if (vf && si) {
                    this.value = vf (si);
                }
                break;
        }
    }

    public onUpdateUI(): void {
        super.onUpdateUI();
        if (this.created) {
            return;
        }

        const openPopup = () => this.app.runAsync( async () => {
            await Atom.delay(200);
            await this.openPopup(true);
        });

        const keyEvent = (e: KeyboardEvent) => {
            this.onKey(e);
        };

        this.render(<div
            styleClass={Bind.oneWay(() => ({
                [this.controlStyle.name]: 1,
                "popup-open": this.isPopupOpen || !this.value
            }))}>
            <input
                type="search"
                autocomplete="none"
                eventFocus={openPopup}
                eventClick={openPopup}
                value={Bind.twoWays(() => this.searchText, ["keyup", "keypress", "keydown"])}
                placeholder={Bind.oneWay(() => this.label)}
                eventKeyDown={keyEvent}
                eventBlur={() => setTimeout(() => this.cancelToken?.cancel(), 100)}/>
            <AtomTemplateControl
                class="item-template"
                contentTemplate={Bind.oneWay(() => this.itemTemplate)}
                data={Bind.oneWay(() => this.selectedItem)}
                />
        </div>);

        // const input = document.createElement("input");
        // input.type = "search";
        // input.autocomplete = "none";
        // input.style.display = "none";
        // this.app.callLater(() => {
        //     input.style.display = "";
        // });
        // const tc = new AtomTemplateControl(this.app);
        // this.append(tc);

        // this.element.appendChild(input);

        // this.bind(this.element,
        //     "styleClass",
        //     [["this", "isPopupOpen"], ["this", "value"]], false, (v, v1) => ({
        //     [this.controlStyle.root.className]: true,
        //     "popup-open": v || !v1
        // }), this);

        // tc.bind(tc.element, "contentTemplate", [["this", "itemTemplate"]], false, null, this);
        // tc.bind(tc.element, "data", [["this", "selectedItem"]], false, null, this);

        // this.bindEvent(input, "focus", openPopup);
        // this.bindEvent(input, "click", openPopup);

        // this.bind(input, "value", [["this", "searchText"]], ["keyup", "keypress", "keydown"] , null, this);
        // this.bind(input, "placeholder", [["this", "label"]], null, null, this);
        // this.bindEvent(input, "blur", () => {
        //     setTimeout(() => {
        //         this.cancelToken?.cancel();
        //     }, 100);
        // });

        // // this.bindEvent(input, "keyup", keyEvent);
        // // this.bindEvent(input, "keydown", keyEvent);
        // this.bindEvent(input, "keydown", keyEvent);

        // this.runAfterInit(() => {
        //     this.setPrimitiveValue(tc.element, "styleClass", this.controlStyle.itemTemplate);
        // });
    }

    public hasProperty(name: string): boolean {
        if (/^(data|selectedItem|itemTemplate|isPopupOpen|value|localViewModel|viewModel)$/.test(name)) {
            return true;
        }
        return super.hasProperty(name);
    }

    protected onSearchTextChanged(force: boolean = false): void {

        if (this.isUpdating) {
            return;
        }
        if (!force) {
            if (this.lastSearchText === this.searchText) {
                return;
            }
            this.lastSearchText = this.searchText;
        }

        setTimeout(() => {
            this.app.runAsync(() => this.openPopup());
        }, 10);

        if (!this.itemsSource) {
            // tslint:disable-next-line:no-console
            console.warn("No itemsSource defined");
            return;
        }

        const s = this.searchText || this.value;
        if (!s) {
            return;
        }

        this.cancelToken?.cancel();

        const c = new CancelToken();
        this.cancelToken = c;

        this.runAsync(async () => {

            await Atom.delay(250, c);

            if (c.cancelled) {
                return;
            }

            const result = this.itemsSource({
                search: this.searchText,
                cancel: c,
                value: this.value
            });
            if (!result) {
                return;
            }
            const rp = result as Promise<any[]>;
            if (rp.then && rp.catch) {
                try {
                    const items = await rp;
                    if (c.cancelled) {
                        return;
                    }
                    this.items.replace(items || []);
                } catch (ex) {
                    c.cancel();
                }
            } else {
                const items = result as any[];
                if (c.cancelled) {
                    return;
                }
                this.items.replace(items || []);
            }

            if (!this.selectedItem) {
                // this.selectedItem = this.items[0];
                const first = this.items[0];
                if (first) {
                    const v1 = this.valueFunc ? this.valueFunc(first) : first;
                    // tslint:disable-next-line: triple-equals
                    if (v1 == this.value) {
                        this.selectedItem = first;
                        this.element.dispatchEvent(new CustomEvent("item-selected", {
                            cancelable: false,
                            bubbles: false,
                            detail: this.selectedItem
                        }));
                    }
                }
            }

        });

    }

    protected runAsync(fx: () => Promise<void>) {
        this.app.runAsync(async () => {
            try {
                await fx();
            } catch (e) {
                const s = e.message || e.toString();
                if (s === "cancelled") {
                    return;
                }
                // tslint:disable-next-line: no-console
                console.error(e);
            }
        });
    }

    protected preCreate(): void {
        this.itemTemplate = null;
        this.items = [];
        this.itemsSource = null;
        this.label = null;
        this.lastSearchText = null;
        this.lastValue = null;
        this.value = null;
        this.isPopupOpen = false;
        this.valueFunc = null;
        this.itemHostTemplate = ItemHost;
        this.searchText = null;
        this.lastSearchText = null;
        this.lastValue = null;
        this.created = false;
        this.isUpdating = false;
        this.defaultControlStyle = AutoCompleteBoxStyle;
    }

    // tslint:disable-next-line: no-empty
    protected create(): void { }

    protected onKey(e: KeyboardEvent): void {
        if (!this.isPopupOpen) {
            return;
        }
        switch (e.key) {
            case KeyCodes.Enter:
                if (this.windowViewModel) {
                    this.element.dispatchEvent(new CustomEvent("item-selected", {
                        cancelable: false,
                        bubbles: false,
                        detail: this.selectedItem
                    }));
                    this.windowViewModel.close(this.selectedItem);
                    this.windowViewModel = null;
                }
                break;
            case KeyCodes.Escape:
                if (this.windowViewModel) {
                    this.windowViewModel.cancel();
                    this.windowViewModel = null;
                }
                break;
            case KeyCodes.ArrowUp:
                this.moveSelection(-1);
                break;
            case KeyCodes.ArrowDown:
                this.moveSelection(+1);
                break;
        }
    }

    protected moveSelection(n: number): void {
        try {
            this.isUpdating = true;
            if (!this.items) {
                return;
            }
            const index = this.items.indexOf(this.selectedItem);
            if (index === -1) {
                if (n > 0 && this.items.length) {
                    this.selectedItem = this.items[0];
                }
                return;
            }
            const newIndex = index + n;
            if (newIndex < 0 || newIndex >= this.items.length) {
                return;
            }
            this.selectedItem = this.items[newIndex];
        } finally {
            this.isUpdating = false;
        }
    }

    protected async openPopup(force: boolean = false): Promise<void> {
        if (this.isPopupOpen) {
            return;
        }
        try {

            if (!force) {
                if (!this.searchText) {
                    return;
                }
            }

            this.isPopupOpen = true;

            this.onSearchTextChanged();

            const rs = this.app.get(ReferenceService);

            const ws = this.app.get(WindowService);

            ws.currentTarget = this.element;

            const iht = rs.put(this.itemHostTemplate);
            const parent = rs.put(this);

            const ns = this.app.resolve(NavigationService) as NavigationService;

            this.previousItem = this.selectedItem;

            const value = await ns.openPage(`app://class/${iht.key}`, {
                "ref:comboBox": parent
            });

            this.selectedItem = value;

        } catch (e) {
            this.selectedItem = this.previousItem;
            // tslint:disable-next-line:triple-equals
            if (e != "cancelled") {
                // tslint:disable-next-line:no-console
                console.warn(e);
            } else {
                this.searchText = "";
            }
            // throw e;
        } finally {
            await Atom.delay(100);
            this.isPopupOpen = false;
        }
    }

}
