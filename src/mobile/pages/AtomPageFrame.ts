import { AtomBinder } from "web-atoms-core/dist/core/AtomBinder";
import { BindableProperty } from "web-atoms-core/dist/core/BindableProperty";
import { AtomControl } from "web-atoms-core/dist/web/controls/AtomControl";
import AtomPageFrameTemplate from "./AtomPageFrameTemplate";
import Page from "./Page";
import PageFrameViewModel from "./PageFrameViewModel";
import TitleTemplate from "./TitleTemplate";

export default class AtomPageFrame extends AtomControl {

    @BindableProperty
    public url: string = null;

    @BindableProperty
    public menuUrl: string = null;

    public frameTemplate: any = AtomPageFrameTemplate;

    public titleTemplate: any = TitleTemplate;

    private mCurrentPage: Page = null;
    public get currentPage(): Page {
        return this.mCurrentPage;
    }

    public set currentPage(v: Page) {
        if (this.mCurrentPage === v) {
            return;
        }
        this.mCurrentPage = v;
        this.bindCommands(v);
        AtomBinder.refreshValue(this, "currentPage");
    }

    private created: boolean = false;

    private frame: AtomPageFrameTemplate;

    private previousCommands: AtomControl = null;

    public preCreate(): void {
        super.preCreate();

        this.localViewModel = this.resolve(PageFrameViewModel, () => ({
            owner: this
        }));

    }

    public onUpdateUI(): void {
        if (this.created) {
            return;
        }

        this.frame = new (this.frameTemplate)(this.app);

        const title = new (this.titleTemplate)(this.app);

        (this.frame.titlePresenter as HTMLElement).appendChild(title.element);

        this.element.appendChild(this.frame.element);

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
