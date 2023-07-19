import { AtomLoader } from "@web-atoms/core/dist/core/AtomLoader";
import { AtomUri } from "@web-atoms/core/dist/core/AtomUri";
import sleep from "@web-atoms/core/dist/core/sleep";
import XNode from "@web-atoms/core/dist/core/XNode";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import { AtomWindowViewModel } from "@web-atoms/core/dist/view-model/AtomWindowViewModel";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import PopupService, { IDialogOptions, PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import PageNavigator from "../PageNavigator";
import { StringHelper } from "@web-atoms/core/dist/core/StringHelper";
import styled from "@web-atoms/core/dist/style/styled";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import { AtomDisposableList } from "@web-atoms/core/dist/core/AtomDisposableList";
import Bind from "@web-atoms/core/dist/core/Bind";
import { CancelToken, IDisposable } from "@web-atoms/core/dist/core/types";
import { ChildEnumerator } from "@web-atoms/core/dist/web/core/AtomUI";
import { displayRouteSymbol, routeSymbol } from "@web-atoms/core/dist/core/Command";
import Route from "@web-atoms/core/dist/core/Route";

    styled.css `

    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    padding: 5px;

    & > [data-container] {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        bottom: 0px;
        transition: left 0.3s ease-out;
    }

    @media screen {
        & {
            position: absolute;
            overflow: hidden;        
        
            & > [data-container] {
                position: absolute;
                overflow: hidden;
            }
        }
    }
    
    &[data-drawer=visible] {

        & > [data-container] {
            left: 80%;
        }

        & > [data-drawer-page] {
            left: 0px;
        }
    }
    
    & div[data-drawer-page=drawer-page] {
        position: absolute;
        top: 0px;
        left: -80%;
        width: 80%;
        height: 100%;
        overflow: hidden;
        transition: left 0.3s ease-out;
    }

    `.installGlobal("[data-page-app=page-app]");
    styled.css `

    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    contain: content;
    transition: transform 0.3s ease-out;
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    grid-template-columns: auto 1fr auto;
    transform: translate(100%,0);

    & > [data-icon-button=icon-button] {
        padding: 5px;
    }
    
    & > [data-page-element=action-bar] {
        z-index: 11;
        grid-row-start: 1;
        grid-column-start: 1;
        grid-column-end: span 3;
        background-color: var(--accent-color, lightgray); 
    }
    
    & > [data-page-element=icon] {
        font-size: 20px;
        z-index: 14;
        padding: 10px;
        text-align: center;
        align-self: center;
        justify-self: center;
        grid-row-start: 1;
        grid-column-start: 1;
        color: var(--accent-text-color, black); 
    }
    
    & > [data-page-element=title] {
        font-size: 20px;
        z-index: 14;
        padding: 5px;
        align-self: center;
        justify-self: stretch;
        grid-row-start: 1;
        grid-column-start: 2;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: var(--accent-text-color, black); 
    }
    
    & > [data-page-element=action] {
        font-size: 20px;
        z-index: 14;
        padding: 10px;
        grid-row-start: 1;
        grid-column-start: 3;
        color: var(--accent-text-color, black); 

        & button {
            width: 30px;
            border: none;
            outline: none;
            background: transparent;
            font-size: inherit; 
        }
    }
    
    & > button[data-page-element=action] {
        min-width: 40px;
        border: none;
        outline: none;
        background: transparent; 
    }
    
    & > [data-page-element=header] {
        z-index: 12;
        padding: 5px;
        grid-row-start: 2;
        grid-column-start: 1;
        grid-column-end: span 3;
        background-color: #c0c0c0; 
    }
    
    & > [data-page-element=pull-to-refresh] {
        grid-row-start: 3;
        grid-column-start: 1;
        grid-column-end: span 3;
        padding: 5px;
        margin: 10px;
        z-index: 9;
        align-self: start;
        justify-self: center; 

        & .pull-icon {
            transition: all 0.3s ease-out; 
        }
        
        &[data-mode=up] .pull-icon {
            transform: rotate(180deg); 
        }
        
        &[data-mode=loading] .pull-icon {
            display: none; 
        }
        
        &:not([data-mode=down]) .down {
            display: none; 
        }
        
        &:not([data-mode=up]) .up {
            display: none; 
        }
        
        &:not([data-mode=loading]) .loading {
            display: none; 
        }
    }
        
    & > [data-page-element=content] {
        grid-row-start: 3;
        grid-column-start: 1;
        grid-column-end: span 3;
        padding: 5px;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;
        z-index: 10;
        scrollbar-width: 5px;
        scrollbar-color: #ffa500 white; 

        &::-webkit-scrollbar {
            width: 5px; 
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: white;
            border-radius: 20px;
            border: 3px solid #ffa500; 
        }
        
    }
        
    & > [data-page-element=footer] {
        grid-row-start: 4;
        grid-column-start: 1;
        grid-column-end: span 3;
        z-index: 11;
        padding: 5px; 
    }
    
    &[data-page-state=ready] {
        transform: translate(0,0); 
    }
    
    &[data-page-state=hidden] {
        transform: translate(-100%,0); 
    }

    &[data-hide-toolbar=true] {

        & > [data-page-element=icon] {
            display: none; 
        }
        
        & > [data-page-element=title] {
            display: none; 
        }
        
        & > [data-page-element=action-bar] {
            display: none; 
        }
        
        & > [data-page-element=action] {
            display: none;    
        }
    }
    
`.installGlobal("[data-base-page=base-page]");

export function PullToRefresh() {
    return <div>
        <i class="pull-icon fa-solid fa-down"/>
        <span class="down" text=" Pull"/>
        <span class="up" text=" Refresh"/>
        <i class="loading fa-duotone fa-spinner fa-spin"/>
    </div>;
}

export class Drawer extends AtomControl {

    // tslint:disable-next-line: no-empty
    protected init(): any { }

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

    /**
     * If set to true, you must set `autofocus` attribute
     * to enable focus when page is visible.
     */
    public disableAutoFocus = false;

    public get route() {
        return this.routeUrl;
    }

    public set route(url: string) {
        if(!url) {
            return;
        }
        url = Route.encodeUrl(url);

        if (history.state?.url === url) {
            return;
        }

        const last = history.state?.url;

        const state = { url };
        history.pushState(state, "", url);
        const eventRegistration = (e: PopStateEvent) => {
            if (e.state?.url === last) {
                this.cancel();
            }
        };
        window.addEventListener("popstate", eventRegistration);
        const d = {
            dispose() {
                window.removeEventListener("popstate", eventRegistration);
                if (history.state?.url === state.url) {
                    history.back();
                }
            }
        };
        this.registerDisposable(d)
    }

    private routeUrl: string;

    private viewModelTitle: string;

    private initialized: boolean;

    private contentElement: HTMLElement;

    private pullToRefreshElement: HTMLElement;

    private pullToRefreshDisposable: IDisposable;

    private scrollTop: number;

    public get hideToolbar() {
        return this.element?.dataset?.hideToolbar ? true : false;
    }
    public set hideToolbar(v: boolean) {
        this.element.dataset.hideToolbar = v ? "true" : "false";
    }

    protected readonly cancelToken: CancelToken;

    public async requestCancel() {
        if (this.closeWarning) {
            if (!await PopupService.confirm({
                message: this.closeWarning
            })) {
                return;
            }
        }
        this.cancel();
    }

    public onPropertyChanged(name) {
        super.onPropertyChanged(name);
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

    /**
     * This is because if someone changes renderer, entire content will
     * vanish, so we need to update allow update of only content element
     * @returns
     */
    protected rendererChanged() {
        for (const content of ChildEnumerator.where(this.element,
            ({ dataset: { pageElement } }) => !pageElement || pageElement === "content")) {
            this.dispose(content);
            content.remove();
        }
        const r = this.renderer;
        if (!r) {
            return;
        }
        delete this.render;
        this.render(r);
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
            super.render(<div>{node}</div>);
            return this.element.querySelector(`[data-page-element="${name}"]`);
        }
        return null;
    }

    protected preCreate(): void {
        this.element.dataset.basePage = "base-page";
        this.iconClass = "";
        this.viewModelTitle = null;
        const c = new CancelToken();
        // @ts-expect-error
        this.cancelToken = c;
        this.registerDisposable({
            dispose() {
                c.cancel();
            }
        });
        this.runAfterInit(() => {
            if (!this.element) {
                return;
            }
            const anyAutofocus = this.element.querySelector(`*[autofocus]`) as HTMLElement;
            if (!anyAutofocus) {
                if (this.disableAutoFocus) {
                    return;
                }
                const windowContent = this.element.querySelector(`[data-page-element="content"]`);
                if (windowContent) {
                    const firstInput = windowContent.querySelector("input,textarea") as HTMLInputElement;
                    if (firstInput) {
                        firstInput.focus();
                        return;
                    }
                }
                return;
            }
            anyAutofocus.focus();
        });

        setTimeout((p) => {
            p.dataset.pageState = "ready";
        }, 1, this.element);

        this.titleRenderer = () => <span
            class="title-text" text={Bind.oneWay(() => this.viewModelTitle || this.title)} />;

        this.iconRenderer = () => <i
            data-icon-button="icon-button"
            class={Bind.oneWay(() => this.iconClass)}
            eventClick={(e1) => this.dispatchIconClickEvent(e1)} />;

        this.actionBarRenderer = () => <div />;

        this.runAfterInit(() => {
            // we will not keep in the dom
            // this is to prevent any heavy animation classes slowing down performance
            this.pullToRefreshElement?.remove?.();
            this.initialized = true;
            this.enablePullToRefreshEvents();
        });

    }

    protected render(node: XNode, e?: any, creator?: any): void {

        if (e || node?.attributes?.["data-page-element"]) {
            super.render(node, e, creator);
            return;
        }

        this.render = super.render;
        const na = (node.attributes ??= {});
        let extracted = {};
        if (!na["data-page-element"]) {
            na["data-page-element"] = "content";
            extracted = this.extractControlProperties(node);
        }
        super.render(<div
            viewModelTitle={Bind.oneWay(() => this.viewModel.title)}
            {...extracted}>
            {node}
        </div>, e, creator);
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

                const ce = new CustomEvent("reloadPage", { detail: this, bubbles: true, cancelable: true });
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
        }, 1);
    }
}

delete (BasePage.prototype as any).init;

export class ContentPage<T = any, TResult = any> extends BasePage {
    public parameters: T;
    public close: (result: TResult) => any;
}

export type InputOf<T extends ContentPage> = T extends ContentPage<infer T> ? T : any;

export type OutputOf<T extends ContentPage> = T extends ContentPage<any, infer T> ? T : any;

export class TabbedPage extends BasePage {

}

export default class MobileApp extends AtomControl {
    public static current: MobileApp;

    public static drawer = XNode.prepare("drawer", true, true);

    public static async pushPage<T>(
        pageUri: string | any,
        parameters: {[key: string]: any} = {},
        clearHistory: boolean = false) {
        const mobileApp = this.current;
        const page = await AtomLoader.loadClass<BasePage>(pageUri, parameters ?? {}, mobileApp.app);
        const result = await mobileApp.loadPage(page, clearHistory);
        return result as T;
    }

    public drawer: typeof Drawer;

    public hideDrawer: () => void;

    public pages: BasePage[];

    public selectedPage: BasePage;

    /**
     * Set this to class or url to load the page when user
     * hits back button when there is nothing in history stack
     */
    public defaultPage: any;

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
        this.defaultPage ??= url;
        const page = await AtomLoader.loadControl<BasePage>(url, this.app);
        if (url.query && url.query.title) {
            page.title ||= url.query.title.toString();
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

        page.title ||= StringHelper.fromPascalToTitleCase(Object.getPrototypeOf(page).constructor.name);

        const { parameters } = page as any;
        const route = parameters?.[displayRouteSymbol];
        if (route) {
            page.route = route;
        }

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

            const closeFactory = (callback, result?) =>
                (r) => {
                    if (clearHistory) {
                        this.app.runAsync(() => this.loadPageForReturn(this.defaultPage, true));
                        return;
                    }
                    // element.dataset.pageState = "";
                    element.removeAttribute("data-page-state");
                    const last = this.pages.pop();
                    (last as any).show();
                    setTimeout(() => {
                        page.dispose();
                        element.remove();
                        callback(r ?? result);
                        this.selectedPage = last;
                    }, 300);    
                };

            const cancel = closeFactory(reject, "cancelled") as any;
            const close = closeFactory(resolve);
            if (vm) {
                vm.cancel = cancel;
                vm.close = close;
            }
            page.cancel = cancel;
            page.close = close;
        });

    }
}

export const isMobileView = /Android|iPhone/i.test(navigator.userAgent)
    || (window.visualViewport.width < 500)
    || (window as any).forceMobileLayout;

const isPopupPage = Symbol("isPopupPage");

class PopupWindowEx extends PopupWindow {

    static [isPopupPage] = true;

    public static dialogOptions: IDialogOptions;
}

const root = (isMobileView ? ContentPage : PopupWindowEx) as typeof AtomControl;

export class PopupWindowPage<TIn = any, TOut = any> extends (root as any as typeof ContentPage) {


    public parameters: TIn;

    public static dialogOptions: IDialogOptions;

    public close: (r: TOut) => void;

    public cancel: (error?: any) => void;

    public title: string;

    public headerRenderer: () => XNode;

    public footerRenderer: () => XNode;

    public titleRenderer: () => XNode;


}

PageNavigator.pushPageForResult =
    (page, parameters, clearHistory) => {
        if (!isMobileView && page[isPopupPage]) {
            const popupPage = page as any as typeof PopupWindowEx;
            const options: IDialogOptions = {
                ... popupPage.dialogOptions ?? {},
                parameters: {
                    parameters
                }
            };
            // we make window modal if not set...
            options.modal ??= true;
            if (options.modal) {
                return (page as any as typeof PopupWindow).showModal(options);
            }
            return (page as any as typeof PopupWindow).showWindow(options);
        }
        return MobileApp.pushPage(page, parameters, clearHistory)
    };

