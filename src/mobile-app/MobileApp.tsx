import { AtomLoader } from "@web-atoms/core/dist/core/AtomLoader";
import { AtomUri } from "@web-atoms/core/dist/core/AtomUri";
import sleep from "@web-atoms/core/dist/core/sleep";
import XNode from "@web-atoms/core/dist/core/XNode";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import { AtomWindowViewModel } from "@web-atoms/core/dist/view-model/AtomWindowViewModel";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { IDialogOptions, PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import PageNavigator from "../PageNavigator";
import { StringHelper } from "@web-atoms/core/dist/core/StringHelper";
import styled from "@web-atoms/core/dist/style/styled";
import { BasePage, ContentPage } from "./ContentPage";
import { Drawer } from "./Drawer";

    styled.css `

    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    padding: 5px;
    overflow: hidden;

    & > [data-container] {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        bottom: 0px;
        overflow: hidden;
        transition: left 0.3s ease-out;
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
        width: 30px;
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
        
        & > * {
            flex-shrink: 0; 
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

