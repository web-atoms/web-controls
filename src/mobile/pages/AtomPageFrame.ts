import { Atom } from "web-atoms-core/dist/Atom";
import { AtomBinder } from "web-atoms-core/dist/core/AtomBinder";
import { AtomBridge } from "web-atoms-core/dist/core/AtomBridge";
import { AtomLoader } from "web-atoms-core/dist/core/AtomLoader";
import { AtomUri } from "web-atoms-core/dist/core/AtomUri";
import { BindableProperty } from "web-atoms-core/dist/core/BindableProperty";
import { NavigationService } from "web-atoms-core/dist/services/NavigationService";
import { AtomWindowViewModel } from "web-atoms-core/dist/view-model/AtomWindowViewModel";
import { AtomControl } from "web-atoms-core/dist/web/controls/AtomControl";
import { AtomFrame } from "web-atoms-core/dist/web/controls/AtomFrame";
import AtomPageFrameTemplate from "./AtomPageFrameTemplate";
import Page from "./Page";
import PageFrameViewModel from "./PageFrameViewModel";
import TitleTemplate from "./TitleTemplate";

export default class AtomPageFrame extends AtomFrame {

    @BindableProperty
    public menuUrl: string;

    public frameTemplate: any;

    public titleTemplate: any;

    @BindableProperty
    public tabsTemplate: any;

    private tabs: AtomControl;

    private tabsPresenter: HTMLElement;

    private created: boolean = false;

    private frame: AtomPageFrameTemplate;

    private previousCommands: AtomControl;

    private previousTabs: AtomControl;

    public preCreate(): void {
        super.preCreate();
        this.menuUrl = null;
        this.tabsTemplate = null;
        this.frameTemplate = AtomPageFrameTemplate;
        this.titleTemplate = TitleTemplate;
        this.created = false;
        this.previousCommands = null;
        this.previousTabs = null;

        this.name = "root";
        this.runAfterInit(() => {
            this.saveScrollPosition = true;
        });
        this.localViewModel = this.resolve(PageFrameViewModel, () => ({
            owner: this
        }));
    }

    public clearStack(): void {
        for (const iterator of this.stack) {
            const e = iterator.page.element;
            iterator.page.dispose();
            e.remove();
        }
        this.stack.length = 0;
    }

    public onUpdateUI(): void {
        if (this.created) {
            return;
        }

        this.frame = new (this.frameTemplate)(this.app);

        const title = new (this.titleTemplate)(this.app);

        (this.frame.titlePresenter as HTMLElement).appendChild(title.element);

        this.element.appendChild(this.frame.element);

        this.pagePresenter = this.frame.pagePresenter;

        this.tabsPresenter = this.frame.tabsPresenter;

        this.frame.bind(this.frame.element, "tabs", [["this", "previousTabs"]], false, null, this);

        this.created = true;

        this.attachTabs(this.tabs);

    }

    public push(ctrl: AtomControl): void {
        if (!this.frame) {
            setTimeout(() => {
                this.push(ctrl);
            }, 100);
            return;
        }
        (ctrl as any).title = null;
        super.push(ctrl);
    }

    public onPropertyChanged(name: keyof AtomPageFrame): void {
        switch (name) {
            case "current":
                this.bindCommands(this.current as Page);
                this.bindTabs(this.current as Page);
                break;
            case "tabsTemplate":
                this.createTabs();
                break;
        }
    }

    public pushUrl(url: string): void {
        if (url === this.url) {
            return;
        }
        // check if we have this url in stack as last item..
        if (this.stack.length > 0) {
            const last = this.stack[this.stack.length - 1];
            if (last.url === url) {
                this.popStack();
                return;
            }
        }

        this.url = url;
    }

    public popStack(windowClosed?: boolean): void {
        // check if top history location is different after popping stack
        if (this.keepStack && windowClosed) {
            history.back();
            return;
        }
        return super.popStack(windowClosed);
    }

    protected createTabs(): void {
        if (!this.tabsTemplate) {
            this.tabs = null;
            this.disposeTabs();
            return;
        }
        this.tabs = (new (this.tabsTemplate)(this.app));
        this.tabs.element._logicalParent = this.element;
        this.attachTabs(this.tabs);
    }

    protected setUrl(url: string): void {
        super.setUrl(url);
        this.localViewModel.url = url;
    }

    protected disposeTabs(): void {
        if (!this.previousTabs) {
            return;
        }
        const e = this.previousTabs.element;
        this.previousTabs.dispose();
        if (e) {
            e.remove();
        }
        this.previousTabs = null;
    }

    protected bindTabs(v: Page): void {
        if (!this.frame) {
            return;
        }

        if (!this.tabsPresenter) {
            return;
        }

        if (this.previousTabs) {
            if (this.tabs !== this.previousTabs) {
                this.disposeTabs();
            }
        }

        if (!v.tabsTemplate) {
            if (this.tabs && this.tabs !== this.previousTabs) {
                this.attachTabs(this.tabs);
            }
            return;
        }

        const t = (new (v.tabsTemplate)(this.app)) as AtomControl;
        t.element._logicalParent = v.element;
        this.attachTabs(t);
    }

    protected bindCommands(v: Page): void {

        if (!this.frame) {
            return;
        }

        if (!this.frame.commandPresenter) {
            return;
        }

        // remove existing commands...
        if (this.previousCommands) {
            const e = this.previousCommands.element;
            // e is null if the control was already
            // destroyed when page was switched from stack
            if (e) {
                this.previousCommands.dispose();
                e.remove();
            }
            this.previousCommands = null;
        }

        if (!v.commandTemplate) {
            return;
        }

        const c: AtomControl = new (v.commandTemplate)(this.app);
        this.previousCommands = c;
        c.element._logicalParent = v.element;
        this.frame.commandPresenter.appendChild(c.element);
    }

    private attachTabs(t: AtomControl) {
        if (!t || !t.element) {
            return;
        }
        if (!this.tabsPresenter) {
            setTimeout(() => {
                this.attachTabs(t);
            }, 100);
            return;
        }
        this.tabsPresenter.innerHTML = "";
        this.tabsPresenter.append(t.element);
        this.previousTabs = t;
        AtomBridge.instance.refreshInherited(t, "data");
        AtomBridge.instance.refreshInherited(t, "viewModel");
        AtomBridge.instance.refreshInherited(t, "localViewModel");
    }

}
