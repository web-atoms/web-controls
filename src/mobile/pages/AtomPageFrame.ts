import { Atom } from "web-atoms-core/dist/Atom";
import { AtomBinder } from "web-atoms-core/dist/core/AtomBinder";
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
    public menuUrl: string = null;

    public frameTemplate: any = AtomPageFrameTemplate;

    public titleTemplate: any = TitleTemplate;

    private created: boolean = false;

    private frame: AtomPageFrameTemplate;

    private previousCommands: AtomControl = null;

    public preCreate(): void {
        super.preCreate();
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
        if (name === "current") {
            this.bindCommands(this.current as Page);
        }
    }

    protected bindCommands(v: Page): void {

        // remove existing commands...
        if (!this.frame.commandPresenter) {
            return;
        }

        if (this.previousCommands) {
            const e = this.previousCommands.element;
            // e is null if the control was already
            // destroyed when page was switched from stack
            if (e) {
                this.previousCommands.dispose();
                e.remove();
            }
        }

        if (!v.commandTemplate) {
            return;
        }

        const c: AtomControl = new (v.commandTemplate)(this.app);
        this.previousCommands = c;
        c.element._logicalParent = v.element;
        (this.frame.commandPresenter as HTMLElement).appendChild(c.element);
    }

}
