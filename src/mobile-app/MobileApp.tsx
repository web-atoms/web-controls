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
    .absolutePosition({ left: 0, top: 0, right: 0, bottom: 0})
    .overflow("hidden")
    .child(StyleRule("[data-container]")
        .absolutePosition({ left: 0, top: 0, bottom: 0, width: "100%"})
        .overflow("hidden")
        .transition("left 0.3s ease-out")
    )
    .and(StyleRule("[data-drawer=visible]")
        .child(StyleRule("[data-container]")
            .left("80%")
        )
        .child(StyleRule("[data-drawer-page]")
            .left(0)
        )
    )
, "div[data-page-app=page-app]");

CSS(StyleRule()
    .absolutePosition({ left: "-80%", top: 0 })
    .width("80%")
    .height("100%")
    .overflow("hidden")
    .transition("left 0.3s ease-out")
, "div[data-drawer-page=drawer-page]");

CSS(StyleRule()
    .absolutePosition({ left: 0, top: 0})
    .width("100%")
    .height("100%")
    .overflow("hidden")
    .transition("transform 0.3s ease-out")
    .display("grid")
    .gridTemplateRows("auto 1fr auto")
    .gridTemplateColumns("auto 1fr auto")
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
        .fontSize(20)
        .padding(10)
        .width(40)
        .height(40)
        .textAlign("center")
        .alignSelf("center")
        .justifySelf("center")
        .gridRowStart("1")
        .gridColumnStart("1")
    )
    .child(StyleRule("[data-page-element=title]")
        .fontSize(20)
        .padding(5)
        .alignSelf("center")
        .justifySelf("stretch")
        .gridRowStart("1")
        .gridColumnStart("2")
    )
    .child(StyleRule("[data-page-element=action]")
        .fontSize(20)
        .padding(10)
        .gridRowStart("1")
        .gridColumnStart("3")
        .nested(StyleRule("button") 
            .width(30)
            .border("none")
            .outline("none")
            .background("transparent" as any)
            .fontSize("inherit")
        )
    )
    .child(StyleRule("button[data-page-element=action]") 
        .width(30)
        .border("none")
        .outline("none")
        .background("transparent" as any)
    )
    .child(StyleRule("[data-page-element=content]")
        .gridRowStart("2")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .padding(5)
        .overflow("hidden")
        .position("relative")
        .overflow("auto")
        .scrollBarWidth("5px")
        .scrollBarColor(Colors.orange, "white")
        // trick to disable shrinking for flexbox
        .child(StyleRule("*")
            .flexShrink("0")
        )
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

// CSS(StyleRule()
//     .paddingBottom(500)
// , "body[data-keyboard=shown] div[data-base-page=base-page] > [data-page-element=content]");

if (/iphone|ios/i.test(window.navigator.userAgent)) {
    CSS(StyleRule()
        .marginBottom(500)
    , "body[data-keyboard=shown] div[data-page-app=page-app]");
}

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
        const na = node.attributes ??= {};
        na["data-page-element"] = "content";
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
        const extracted = this.extractControlProperties(node);
        super.render(<div
            viewModelTitle={Bind.oneWay(() => this.viewModel.title)}
            { ... extracted }>
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

    protected hide() {
        this.element.dataset.pageState = "hidden";
        this.element._logicalParent = this.element.parentElement;
        setTimeout(() => {
            this.element?.remove();
        }, 400);
    }

    protected show() {
        this.element._logicalParent.appendChild(this.element);
        this.element.dataset.pageState = "ready";
    }
}

export class ContentPage extends BasePage {
}

export class TabbedPage extends BasePage {

}

export class Drawer extends AtomControl {
    protected preCreate(): void {
        this.element.dataset.drawerPage = "drawer-page";
        this.bindEvent(this.element, "click", (e: Event) => e.defaultPrevented ? null : this.closeDrawer());
    }

    protected closeDrawer() {
        const ce = new CustomEvent("closeDrawer", { bubbles: true });
        this.element.dispatchEvent(ce);
    }
}

export default class MobileApp extends AtomControl {

    public static drawer = XNode.prepare("drawer", true, true);

    public drawer: typeof Drawer;

    public hideDrawer: () => void;

    public pages: BasePage[];

    public selectedPage: BasePage;

    public icon: any;

    private container: HTMLDivElement;

    public async back() {
        if (this.pages.length === 0) {

            const drawer = this.drawer;
            if (drawer && !this.hideDrawer) {
                const drawerPage = new drawer(this.app);
                // const da = drawerNode.attributes ??= {};
                const dispatchCloseDrawer = (de: Event) => {
                    if (de.defaultPrevented) {
                        return;
                    }
                    de.target.dispatchEvent(new CustomEvent("closeDrawer", { bubbles: true }));
                };
                this.element.appendChild(drawerPage.element);
                setTimeout(() => {
                    this.element.dataset.drawer = "visible";
                    this.element.addEventListener("click", dispatchCloseDrawer);
                }, 10);
                this.hideDrawer = () => {
                    this.element.dataset.drawer = "";
                    this.element.removeEventListener("click", dispatchCloseDrawer);
                    setTimeout(() => {
                        const de = drawerPage.element;
                        drawerPage.dispose();
                        de.remove();
                    }, 400);
                    this.hideDrawer = undefined;
                };
                return false;
            }

            return true;
        }

        this.selectedPage.cancel("cancelled");
        return false;
    }

    protected preCreate(): void {

        // tslint:disable-next-line: ban-types
        window.addEventListener("backButton", (ce: CustomEvent<Function>) => {
            const { detail } = ce;
            ce.preventDefault();
            this.app.runAsync(async () => {
                if (await this.back()) {
                    detail();
                }
            });
        });

        // disable top level scroll
        document.body.style.overflow = "hidden";
        this.drawer = null;
        this.element.dataset.pageApp = "page-app";
        const container = this.container = document.createElement("div");
        container.dataset.container = "true";
        this.element.appendChild(container);
        this.pages = [];
        this.selectedPage = null;
        this.bindEvent(this.element, "iconClick", (e) => { this.icon = e.target; return this.back(); });
        this.bindEvent(this.element, "closeDrawer", (e) => {
            this.hideDrawer?.();
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
            (selectedPage as any).hide();
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

        this.container.appendChild(page.element);
        this.selectedPage = page;

        const vm = page.viewModel as AtomWindowViewModel;
        const element = page.element;
        return new Promise((resolve, reject) => {
            const cancel: any = (error?) => {
                // page.dispose();
                // element.remove();
                element.dataset.pageState = "";
                const last = this.pages.pop();
                (last as any).show();
                // last.element.dataset.pageState = "ready";
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
                (last as any).show();
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
