import { AtomLoader } from "@web-atoms/core/dist/core/AtomLoader";
import { AtomUri } from "@web-atoms/core/dist/core/AtomUri";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import { CancelToken, IClassOf, IDisposable } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomWindowViewModel } from "@web-atoms/core/dist/view-model/AtomWindowViewModel";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import PopupService, { ConfirmPopup, IPopup, PopupControl } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

CSS(StyleRule()
    .absolutePosition({ left: 0, top: 0, bottom: 0, right: 0})
    .overflow("hidden")
, "div[data-page-app=page-app]");

CSS(StyleRule()
    .absolutePosition({ left: 0, top: 0, bottom: 0, right: 0})
    .overflow("hidden")
    .transition("transform 0.3s ease-out")
    .display("grid")
    .gridTemplateRows("25px 1fr auto")
    .gridTemplateColumns("25px 1fr auto")
    .child(StyleRule("[data-icon-button=icon-button]")
        .padding(5)
    )
    .child(StyleRule("[data-page-element=header]")
        .gridRowStart("1")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .backgroundColor(Colors.silver)
    )
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

    public iconClass: any;

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
        this.iconClass = "";
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
            p.dataset.pageState = "ready";
        }, 10, this.element);
    }

    protected render(node: XNode, e?: any, creator?: any): void {
        this.render = super.render;
        const titleContent = this.titleRenderer?.() ?? <span
            class="title-text" text={Bind.oneWay(() => this.title)}/>;
        const icon = this.iconRenderer?.() ?? <i
            data-icon-button="icon-button"
            class={Bind.oneWay(() => this.iconClass)}
            eventClick={(e1) => this.dispatchIconClickEvent(e1)}/>;
        const action = this.actionRenderer?.() ?? undefined;
        const footer = this.footerRenderer?.() ?? undefined;
        const header = this.headerBackgroundRenderer?.() ?? <div/>;
        const a = node.attributes ??= {};
        a["data-page-element"] = "content";
        if (header) {
            header.attributes ??= {};
            header.attributes["data-page-element"] = "header";
        }
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
            { header }
            { icon }
            { titleContent }
            { action }
            { node }
            { footer }
        </div>);
    }

    protected dispatchIconClickEvent(e: Event) {
        const ce = new CustomEvent("iconClick", { bubbles: true });
        e.target.dispatchEvent(ce);
    }
}

export class ContentPage extends BasePage {
}

export class TabbedPage extends BasePage {

}

export class Drawer extends AtomControl {
    protected preCreate(): void {
        this.bindEvent(this.element, "click", (e) => this.closeDrawer());
    }

    protected closeDrawer() {
        const ce = new CustomEvent("closeDrawer", { bubbles: true });
        this.element.dispatchEvent(ce);
    }
}

export default class MobileApp extends AtomControl {

    public static drawer = XNode.prepare("drawer", true, true);

    public drawer: () => XNode;

    public drawerCancelToken: CancelToken;

    public pages: BasePage[];

    public selectedPage: BasePage;

    public icon: any;

    public async back() {
        if (this.pages.length === 0) {

            const drawer = this.drawer;
            if (drawer) {
                const drawerNode = this.drawer();
                const da = drawerNode.attributes ??= {};
                da["event-click"] = (de: Event) => {
                    de.target.dispatchEvent(new CustomEvent("closeDrawer", { bubbles: true }));
                };
                class DrawerPopup extends PopupControl {
                    protected create(): void {
                        this.render(<div event-close-drawer={() => cancelToken.cancel()}>
                            { drawerNode }
                        </div>);
                    }
                }
                const cancelToken = new CancelToken();
                this.drawerCancelToken = cancelToken;
                DrawerPopup.showControl(this.icon, { cancelToken });
            }

            return;
        }

        this.selectedPage.cancel("cancelled");
    }

    protected preCreate(): void {
        this.drawer = null;
        this.element.dataset.pageApp = "page-app";
        this.pages = [];
        this.selectedPage = null;
        this.bindEvent(this.element, "iconClick", (e) => { this.icon = e.target; return this.back(); });
        this.bindEvent(this.element, "closeDrawer", (e) => {
            this.drawerCancelToken?.cancel();
            this.drawerCancelToken = undefined;
        });
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

        const hasPages = !clearHistory && this.pages.length;

        if (clearHistory) {
            for (const iterator of this.pages) {
                const e = iterator.element;
                iterator.dispose();
                e.remove();
            }
            this.pages.length = 0;
            this.selectedPage = null;
        }

        if (!hasPages) {
            page.element.dataset.pageState = "ready";
            page.iconClass = "fas fa-bars";
        } else {
            page.iconClass = "fas fa-arrow-left";
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
                    this.selectedPage = last;
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
                    this.selectedPage = last;
                }, 300);
            };
            vm.cancel = cancel;
            page.cancel = cancel;
            vm.close = close;
            page.close = close;
        });

    }
}