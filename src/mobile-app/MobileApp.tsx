import { AtomDisposableList } from "@web-atoms/core/dist/core/AtomDisposableList";
import { AtomLoader } from "@web-atoms/core/dist/core/AtomLoader";
import { AtomUri } from "@web-atoms/core/dist/core/AtomUri";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import Colors from "@web-atoms/core/dist/core/Colors";
import sleep from "@web-atoms/core/dist/core/sleep";
import { CancelToken, IClassOf, IDisposable } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import { IPageOptions, NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomWindowViewModel } from "@web-atoms/core/dist/view-model/AtomWindowViewModel";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { AtomUI, ChildEnumerator } from "@web-atoms/core/dist/web/core/AtomUI";
import PopupService, { ConfirmPopup, IPopup, PopupControl } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import PageNavigator from "../PageNavigator";

CSS(StyleRule()
    .absolutePosition({ left: 0, top: 0, right: 0, bottom: 0})
    .padding(5)
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
    .nested(StyleRule("div[data-drawer-page=drawer-page]")
        .absolutePosition({ left: "-80%", top: 0 })
        .width("80%")
        .height("100%")
        .overflow("hidden")
        .transition("left 0.3s ease-out")
    )
, "div[data-page-app=page-app]");

// CSS(StyleRule()
//     .absolutePosition({ left: "-80%", top: 0 })
//     .width("80%")
//     .height("100%")
//     .overflow("hidden")
//     .transition("left 0.3s ease-out")
// , "div[data-drawer-page=drawer-page]");

CSS(StyleRule()
    .absolutePosition({ left: 0, top: 0})
    .width("100%")
    .height("100%")
    .overflow("hidden")
    .transition("transform 0.3s ease-out")
    .display("grid")
    .gridTemplateRows("auto auto 1fr auto")
    .gridTemplateColumns("auto 1fr auto")
    .child(StyleRule("[data-icon-button=icon-button]")
        .padding(5)
    )
    .child(StyleRule("[data-page-element=action-bar]")
        .zIndex(11)
        .gridRowStart("1")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .backgroundColor(Colors.silver)
    )
    .child(StyleRule("[data-page-element=icon]")
        .fontSize(20)
        .zIndex(14)
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
        .zIndex(14)
        .padding(5)
        .alignSelf("center")
        .justifySelf("stretch")
        .gridRowStart("1")
        .gridColumnStart("2")
        .textEllipsis()
    )
    .child(StyleRule("[data-page-element=action]")
        .fontSize(20)
        .zIndex(14)
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
    .child(StyleRule("[data-page-element=header]")
        .zIndex(12)
        .padding(5)
        .gridRowStart("2")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .backgroundColor(Colors.silver)
    )
    .child(StyleRule("[data-page-element=pull-to-refresh]")
        .gridRowStart("3")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .padding(5)
        .margin(10)
        .zIndex(9)
        .alignSelf("start" as any)
        .justifySelf("center")
        .nested(StyleRule(".pull-icon")
            .transition("all 0.3s ease-out")
        )
        .and(StyleRule("[data-mode=up] .pull-icon")
            .transform("rotate(180deg)" as any)
        )
        .and(StyleRule("[data-mode=loading] .pull-icon")
            .display("none")
        )
        .and(StyleRule(":not([data-mode=down]) .down")
            .display("none")
        )
        .and(StyleRule(":not([data-mode=up]) .up")
            .display("none")
        )
        .and(StyleRule(":not([data-mode=loading]) .loading")
            .display("none")
        )
    )
    .child(StyleRule("[data-page-element=content]")
        .gridRowStart("3")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .padding(5)
        .position("relative")
        .overflowX("hidden")
        .overflowY("auto")
        .zIndex(10)
        .scrollBarWidth("5px")
        .scrollBarColor(Colors.orange, "white")
        // trick to disable shrinking for flexbox
        .child(StyleRule("*")
            .flexShrink("0")
        )
    )
    .child(StyleRule("[data-page-element=footer]")
        .gridRowStart("4")
        .gridColumnStart("1")
        .gridColumnEnd("span 3")
        .zIndex(11)
        .padding(5)
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

// if (/iphone|ios/i.test(window.navigator.userAgent)) {
//     CSS(StyleRule()
//         .marginBottom(500)
//     , "body[data-keyboard=shown] div[data-page-app=page-app]");
// }

export function PullToRefresh() {
    return <div>
        <i class="pull-icon fa-solid fa-down"/>
        <span class="down" text=" Pull"/>
        <span class="up" text=" Refresh"/>
        <i class="loading fa-duotone fa-spinner fa-spin"/>
    </div>;
}

export class BasePage extends AtomControl {

    public close: (result) => void;

    public cancel: (error?) => void;

    @BindableProperty
    public closeWarning: string;

    @BindableProperty
    public title?: string;

    @BindableProperty
    public titleRenderer: () => XNode;

    @BindableProperty
    public iconRenderer: () => XNode;

    @BindableProperty
    public actionRenderer: () => XNode;

    @BindableProperty
    public footerRenderer: () => XNode;

    @BindableProperty
    public actionBarRenderer: () => XNode;

    @BindableProperty
    public headerRenderer: () => XNode;

    @BindableProperty
    public pullToRefreshRenderer: () => XNode;

    public iconClass: any;

    private viewModelTitle: string;

    private initialized: boolean;

    private contentElement: HTMLElement;

    private pullToRefreshElement: HTMLElement;

    private pullToRefreshDisposable: IDisposable;

    private scrollTop: number;

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

    public onPropertyChanged(name) {
        super.onPropertyChanged(name);

        if (!this.initialized) {
            return;
        }
        switch (name) {
            case "footerRenderer":
                this.recreate(name, "footer");
                break;
            case "iconRenderer":
                this.recreate(name, "icon");
                break;
            case "titleRenderer":
                this.recreate(name, "title");
                break;
            case "actionRenderer":
                this.recreate(name, "action");
                break;
            case "headerRenderer":
                this.recreate(name, "header");
                break;
            case "pullToRefreshRenderer":
                this.pullToRefreshElement = this.recreate(name, "pull-to-refresh");
                this.pullToRefreshElement?.remove();
                this.enablePullToRefreshEvents();
                break;
            case "actionBarRenderer":
                this.recreate(name, "action-bar");
                break;
        }
    }

    // tslint:disable-next-line: no-empty
    protected init(): any {

    }

    protected recreate(renderer, name): HTMLElement {
        const node = this[renderer]?.() ?? undefined;
        for (const e of ChildEnumerator.enumerate(this.element)) {
            if (e.dataset.pageElement === name) {
                this.dispose(e);
                e.remove();
                break;
            }
        }
        if (node) {
            const na = node.attributes ??= {};
            na["data-page-element"] = name;
            this.render(<div>{node}</div>);
            return this.element.querySelector(`[data-page-element="${name}"]`);
        }
        return null;
    }

    protected preCreate(): void {
        this.element.dataset.basePage = "base-page";
        this.iconClass = "";
        this.viewModelTitle = null;
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

        this.titleRenderer = <span
            class="title-text" text={Bind.oneWay(() => this.viewModelTitle || this.title)}/>;

        this.iconRenderer = <i
            data-icon-button="icon-button"
            class={Bind.oneWay(() => this.iconClass)}
            eventClick={(e1) => this.dispatchIconClickEvent(e1)}/>;

        this.actionBarRenderer = <div/>;

        this.runAfterInit(() => {
            // we will not keep in the dom
            // this is to prevent any heavy animation classes slowing down performance
            this.pullToRefreshElement?.remove?.();
            this.initialized = true;
            this.enablePullToRefreshEvents();
        })

    }

    protected render(node: XNode, e?: any, creator?: any): void {
        this.render = super.render;
        (node.attributes ??= {})["data-page-element"] = "content";
        const extracted = this.extractControlProperties(node);
        super.render(<div
            viewModelTitle={Bind.oneWay(() => this.viewModel.title)}
            { ... extracted }>
        </div>);
        this.contentElement = this.element.querySelector("[data-page-element='content']");
        
        setTimeout(() => this.contentElement.scrollTo(0, 0), 100);
    }

    protected enablePullToRefreshEvents() {
        const e = this.pullToRefreshElement;
        if (!e) {
            this.pullToRefreshDisposable?.dispose();
            this.pullToRefreshDisposable = void 0;
            return e;
        }
        if (this.pullToRefreshDisposable) {
            return;
        }

        let elementAdded = false;

        const touchStart = (te: Event) => {

            if (!this.pullToRefreshElement) {
                this.pullToRefreshDisposable?.dispose();
                this.pullToRefreshDisposable = null;
                return;
            }

            if (this.contentElement.scrollTop > 0) {
                return;
            }

            const isMouseEvent = te.type === "mousedown";
            const moveEventName = isMouseEvent ? "mousemove" : "touchmove";
            const endEventName = isMouseEvent ? "mouseup" : "touchend";
            const startY = isMouseEvent ? (te as MouseEvent).screenY : (te as TouchEvent).touches[0].screenY;

            this.pullToRefreshElement.dataset.mode = "down";

            if (isMouseEvent) {
                te.stopPropagation();
                te.preventDefault();
            }

            const d = new AtomDisposableList();
            d.add(() => {
                this.contentElement.style.removeProperty("touch-action");
            });
            d.add(this.bindEvent(this.contentElement, moveEventName, (me: Event) => {
                const screenY = isMouseEvent ? (me as MouseEvent).screenY : (me as TouchEvent).touches[0].screenY;
                const diffX = Math.min(75, screenY - startY);

                if (diffX > 5) {
                    if (!elementAdded) {
                        this.contentElement.style.touchAction = "none";
                        elementAdded = true;
                        this.element.appendChild(this.pullToRefreshElement);
                    }
                } else {
                    return;
                }

                this.contentElement.style.transform = `translateY(${diffX}px)`;
                if (diffX > 50) {
                    this.pullToRefreshElement.dataset.mode = "up";
                } else {
                    this.pullToRefreshElement.dataset.mode = "down";
                }
            }, null, { passive: true }));
            d.add(this.bindEvent(this.contentElement, endEventName, (ue: MouseEvent) => {
                ue.stopPropagation();
                if (isMouseEvent) {
                    ue.stopImmediatePropagation();
                    ue.preventDefault();
                }
                d.dispose();

                const done = () => {
                    delete this.pullToRefreshElement.dataset.mode;
                    this.contentElement.style.transform = ``;
                    this.pullToRefreshElement.style.transform = "";
                    this.pullToRefreshElement.remove();
                    elementAdded = false;
                };

                const diffX = ue.screenY - startY;
                if (diffX <= 50) {
                    done();
                    return;
                }

                const ce = new CustomEvent("reloadPage", { detail: this, bubbles: true, cancelable: true});
                this.contentElement.dispatchEvent(ce);
                if (ce.defaultPrevented) {
                    done();
                    return;
                }

                this.pullToRefreshElement.dataset.mode = "loading";

                const promise = (ce as any).promise as PromiseLike<void>;
                if (!promise) {
                    done();
                    return;
                }

                promise.then(done, done);

            }, null, { passive: !isMouseEvent }));
        };

        const ed = new AtomDisposableList();
        ed.add(this.bindEvent(this.contentElement, "mousedown", touchStart));
        ed.add(this.bindEvent(this.contentElement, "touchstart", touchStart, null, { passive: true }));

        this.pullToRefreshDisposable = ed;

        // this.pullToRefreshDisposable = this.bindEvent(this.contentElement, "pointerdown", (de: MouseEvent) => {
        //     if (!this.pullToRefreshElement) {
        //         this.pullToRefreshDisposable?.dispose();
        //         this.pullToRefreshDisposable = null;
        //         return;
        //     }

        //     if (this.contentElement.scrollTop > 0) {
        //         return;
        //     }

        //     this.element.appendChild(this.pullToRefreshElement);
        //     this.pullToRefreshElement.dataset.mode = "down";

        //     const d = new AtomDisposableList();
        //     const startY = de.screenY;
        //     this.contentElement.style.touchAction = "none";
        //     d.add(() => {
        //         this.contentElement.style.removeProperty("touch-action");
        //     });
        //     d.add(this.bindEvent(this.contentElement, "pointermove", (me: MouseEvent) => {

        //         const diffX = Math.min(75, me.screenY - startY);
        //         this.contentElement.style.transform = `translateY(${diffX}px)`;
        //         if (diffX > 50) {
        //             this.pullToRefreshElement.dataset.mode = "up";
        //         } else {
        //             this.pullToRefreshElement.dataset.mode = "down";
        //         }
        //     }));
        //     d.add(this.bindEvent(this.contentElement, "pointerup", (ue: MouseEvent) => {
        //         ue.stopPropagation();
        //         ue.preventDefault();
        //         d.dispose();

        //         const done = () => {
        //             delete this.pullToRefreshElement.dataset.mode;
        //             this.contentElement.style.transform = ``;
        //             this.pullToRefreshElement.style.transform = "";
        //             this.pullToRefreshElement.remove();
        //         };

        //         const diffX = ue.screenY - startY;
        //         if (diffX <= 50) {
        //             done();
        //             return;
        //         }

        //         const ce = new CustomEvent("reloadPage", { detail: this, bubbles: true, cancelable: true});
        //         this.contentElement.dispatchEvent(ce);
        //         if (ce.defaultPrevented) {
        //             done();
        //             return;
        //         }

        //         this.pullToRefreshElement.dataset.mode = "loading";

        //         const promise = (ce as any).promise as PromiseLike<void>;
        //         if (!promise) {
        //             done();
        //             return;
        //         }

        //         promise.then(done, done);

        //     }));
        // });
    }

    protected dispatchIconClickEvent(e: Event) {
        const ce = new CustomEvent("iconClick", { bubbles: true });
        e.target.dispatchEvent(ce);
    }

    protected hide() {
        this.element.dataset.pageState = "hidden";
        this.element._logicalParent = this.element.parentElement;
        this.scrollTop = this.contentElement?.scrollTop;
        setTimeout(() => {
            this.element?.remove();
        }, 400);
    }

    protected show() {
        this.element._logicalParent.appendChild(this.element);
        setTimeout(() => {
            if (this.scrollTop) {
                this.contentElement.scrollTop = this.scrollTop;
            }
            this.element.dataset.pageState = "ready";
        }, 10);
    }
}

delete (BasePage.prototype as any).init;

export class ContentPage<T = any, TResult = any> extends BasePage {
    public parameters: T;
    public close: (result: TResult) => any;
}

export class TabbedPage extends BasePage {

}

export class Drawer extends AtomControl {

    // tslint:disable-next-line: no-empty
    protected init(): any {}

    protected preCreate(): void {
        this.element.dataset.drawerPage = "drawer-page";
        this.bindEvent(this.element, "click", (e: Event) => e.defaultPrevented ? null : this.closeDrawer());
        this.runAfterInit(() => this.app.runAsync(() => this.init?.()));
    }

    protected closeDrawer() {
        const ce = new CustomEvent("closeDrawer", { bubbles: true });
        this.element.dispatchEvent(ce);
    }
}

delete (Drawer.prototype as any).init;

export default class MobileApp extends AtomControl {
    public static current: MobileApp;

    public static drawer = XNode.prepare("drawer", true, true);

    public static async pushPage<T>(
        pageUri: string | any,
        parameters: {[key: string]: any} = {},
        clearHistory: boolean = false) {
        const mobileApp = this.current;
        const page = await AtomLoader.loadClass<BasePage>(pageUri, parameters, mobileApp.app);
        const result = await mobileApp.loadPage(page, clearHistory);
        return result as T;
    }

    public drawer: typeof Drawer;

    public hideDrawer: () => void;

    public pages: BasePage[];

    public selectedPage: BasePage;

    private container: HTMLDivElement;

    public popTo(w: any) {
        this.app.runAsync(async () => {
            while (this.selectedPage !== w) {
                this.selectedPage.cancel();
                await sleep(500);
            }
        });
    }

    public async back() {
        if (this.pages.length === 0) {

            const drawer = this.drawer;
            if (drawer && !this.hideDrawer) {
                const drawerPage = new drawer(this.app);

                // (drawerPage as any).init?.()?.catch((error) => {
                //     if (!CancelToken.isCancelled(error)) {
                //         // tslint:disable-next-line: no-console
                //         console.error(error);
                //     }
                // });

                const modalClose = (ce: Event) => {
                    let start = ce.target as HTMLElement;
                    const de = drawerPage.element;
                    while (start) {
                        if (start === de) {
                            return;
                        }
                        start = start.parentElement;
                    }
                    ce.preventDefault();
                    ce.stopImmediatePropagation?.();
                    ce.target.dispatchEvent(new CustomEvent("closeDrawer", { bubbles: true }));
                };

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
                    drawerPage.bindEvent(this.element, "click", dispatchCloseDrawer);
                    drawerPage.bindEvent(document.body, "click", modalClose, null, true);
                }, 10);
                this.hideDrawer = () => {
                    this.element.dataset.drawer = "";
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

    protected async init() {

    }

    protected preCreate(): void {

        MobileApp.current = this;

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
        this.bindEvent(this.element, "iconClick", (e) => this.back());
        this.bindEvent(this.element, "closeDrawer", (e) => {
            this.hideDrawer?.();
        });
        const navigationService = this.app.resolve(NavigationService);
        navigationService.registerNavigationHook(
            (uri, { target, clearHistory }) => {
                if (/^(app|root)$/.test(target)) {
                    return this.loadPageForReturn(uri, clearHistory);
                }
            }
        );
        this.runAfterInit(() => this.app.runAsync(() => this.init()));
    }

    protected async loadPageForReturn(url: AtomUri, clearHistory: boolean): Promise<any> {
        const page = await AtomLoader.loadControl<BasePage>(url, this.app);
        if (url.query && url.query.title) {
            page.title = url.query.title.toString();
        }
        const p = await this.loadPage(page, clearHistory);
        try {
            return await (p as any);
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

    protected async loadPage(page: BasePage, clearHistory: boolean) {
        page.title ??= "Title";
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
            if (vm) {
                vm.cancel = cancel;
                vm.close = close;
            }
            page.cancel = cancel;
            page.close = close;
        });

    }
}

PageNavigator.pushPageForResult =
    (page, parameters, clearHistory) =>
        MobileApp.pushPage(page, parameters, clearHistory);
