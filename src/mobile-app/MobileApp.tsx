import { AtomLoader } from "@web-atoms/core/dist/core/AtomLoader";
import { AtomUri } from "@web-atoms/core/dist/core/AtomUri";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import { IClassOf, IDisposable } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomWindowViewModel } from "@web-atoms/core/dist/view-model/AtomWindowViewModel";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import PopupService, { ConfirmPopup, IPopup } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

CSS(StyleRule()
    .absolutePosition({ left: 0, top: 0, bottom: 0, right: 0})
, "div[data-page-app=page-app]");

CSS(StyleRule()
    .absolutePosition({ left: 0, top: 0, bottom: 0, right: 0})
    .transition("transform 0.3s cubic-bezier(0.55, 0.09, 0.97, 0.32)")
    .display("grid")
    .gridTemplateRows("25px 1fr auto")
    .gridTemplateColumns("25px 1fr auto")
    .child(StyleRule("[data-page-element=icon]")
        .gridRowStart("1")
        .gridColumnStart("1")
    )
    .child(StyleRule("[data-page-element=title]")
        .gridRowStart("1")
        .gridColumnStart("2")
    )
    .child(StyleRule("[data-page-element=action]")
        .gridRowStart("1")
        .gridColumnStart("3")
    )
    .child(StyleRule("[data-page-element=content]")
        .gridRowStart("2")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
    )
    .child(StyleRule("[data-page-element=footer]")
        .gridRowStart("3")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
    )
    .transform("translate(100%,0)" as any)
    .and(StyleRule("[data-page-state=ready]")
        .transform("translate(0,0)" as any)
    )
    .and(StyleRule("[data-page-state=hidden]")
        .transform("translate(-100%,0)" as any)
    )
, "div[data-base-page=base-page]");

export class BasePage extends AtomControl {

    public close: (result) => void;

    public cancel: (error?) => void;

    @BindableProperty
    public closeWarning: string;

    @BindableProperty
    public title?: string;

    public titleRenderer: () => XNode;

    public iconRenderer: () => XNode;

    public actionRenderer: () => XNode;

    public footerRenderer: () => XNode;

    public headerBackgroundRenderer: () => XNode;


    public async requestCancel() {
        if (this.closeWarning) {
            if (!await ConfirmPopup.showModal<boolean>({
                parameters: {
                    message : this.closeWarning
                }
            })) {
                return;
            }
        }
        this.cancel();
    }

    protected preCreate(): void {
        this.element.dataset.basePage = "base-page";
        this.runAfterInit(() => {
            if (!this.element) {
                return;
            }
            const anyAutofocus = this.element.querySelector(`*[autofocus]`);
            if (!anyAutofocus) {
                const windowContent = this.element.querySelector(`[data-page-element="content"]`);
                if (windowContent) {
                    const firstInput = windowContent.querySelector("input,button,a,textarea") as HTMLInputElement;
                    if (firstInput) {
                        firstInput.focus();
                        return;
                    }    
                }
                return;
            }
        });

        setTimeout((p) => {
            p.dataset.pageState = "true";
        }, 10, this.element);        
    }

    protected render(node: XNode, e?: any, creator?: any): void {
        this.render = super.render;
        const titleContent = this.titleRenderer?.() ?? <span
            class="title-text" text={Bind.oneWay(() => this.title)}/>;
        const icon = this.iconRenderer?.() ?? <i
            eventClick={Bind.event(() => this.requestCancel())}/>;
        const action = this.actionRenderer?.() ?? undefined;
        const footer = this.footerRenderer?.() ?? undefined;
        const a = node.attributes ??= {};
        a["data-page-element"] = "content";
        if (icon) {
            icon.attributes ??= {};
            icon.attributes["data-page-element"] = "icon";
        }
        if (titleContent) {
            titleContent.attributes ??= {};
            titleContent.attributes["data-page-element"] = "title";
        }
        if (action) {
            action.attributes ??= {};
            action.attributes["data-page-element"] = "action";
        }
        if (footer) {
            footer.attributes ??= {};
            footer.attributes["data-page-element"] = "footer";
        }
        super.render(<div viewModelTitle={Bind.oneWay(() => this.viewModel.title)}>
            { icon }
            { titleContent }
            { action }
            { node }
            { footer }
        </div>);
    }
}

export class ContentPage extends BasePage {
}

export class TabbedPage extends BasePage {
    
}

export default class MobileApp extends AtomControl {

    public static drawer = XNode.prepare("drawer", true, true);

    public drawer: IClassOf<AtomControl>;

    public drawerDisposable: IPopup;

    public pages: BasePage[];

    public selectedPage: BasePage;

    public icon: any;

    public async back() {
        if (this.pages.length === 0) {

            const drawer = this.drawer;
            if (drawer) {
                const ne = new drawer(this.app);
                this.drawerDisposable = PopupService.show(
                    this.icon, ne.element, { alignment: "auto" } );
            }

            return;
        }

        const vm = this.selectedPage.viewModel as AtomWindowViewModel;
        if (vm.cancel) {
            return await vm.cancel();
        }
        this.selectedPage.requestCancel();
    }

    protected preCreate(): void {
        this.drawer = null;
        this.pages = [];
        this.selectedPage = null;
        const navigationService = this.app.resolve(NavigationService);
        navigationService.registerNavigationHook(
            (uri, { target, clearHistory }) => {
                if (target === "app") {
                    return this.loadPageForReturn(uri, clearHistory);
                }
            }
        );
    }

    protected async loadPageForReturn(url: AtomUri, clearHistory: boolean): Promise<any> {
        const p = await this.loadPage(url, clearHistory);
        try {
            return await (p as any).returnPromise;
        } catch (ex) {
            // this will prevent warning in chrome for unhandled exception
            if ((ex.message ? ex.message : ex) === "cancelled") {
                // tslint:disable-next-line: no-console
                console.warn(ex);
                return;
            }
            throw ex;
        }
    }

    protected async loadPage(url: AtomUri, clearHistory: boolean) {
        const { view: page, disposables } =
        await AtomLoader.loadView<BasePage>(url, this.app, false, () => new AtomWindowViewModel(this.app));
        page.title = "Title";
        if (url.query && url.query.title) {
            page.title = url.query.title.toString();
        }

        page.bind(page.element, "title", [["viewModel", "title"]]);

        const selectedPage = this.selectedPage;
        if (selectedPage) {
            selectedPage.element.dataset.pageState = "hidden";
            this.pages.add(selectedPage);
        }

        if (clearHistory) {
            for (const iterator of this.pages) {
                const element = iterator.element;
                iterator.dispose();
                element.remove();
            }
            this.pages.length = 0;
            this.selectedPage = null;
        }

        this.element.appendChild(page.element);
        this.selectedPage = page;

        const vm = page.viewModel as AtomWindowViewModel;
        const element = page.element;
        return new Promise((resolve, reject) => {
            const cancel: any = (error?) => {
                // page.dispose();
                // element.remove();
                element.dataset.pageState = "";
                const last = this.pages.pop();
                last.element.dataset.pageState = "ready";
                setTimeout(() => {
                    page.dispose();
                    element.remove();
                    reject(error ?? "cancelled");
                }, 300);
            };
            const close: any = (r) => {
                // page.dispose();
                // element.remove();
                delete element.dataset.pageState;
                const last = this.pages.pop();
                last.element.dataset.pageState = "ready";
                setTimeout(() => {
                    page.dispose();
                    element.remove();
                    resolve(r);
                }, 300);
            };
            vm.cancel = cancel;
            page.cancel = cancel;
            vm.close = close;
            page.close = close;
        });

    }    
}
