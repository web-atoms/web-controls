import { AtomDisposableList } from "@web-atoms/core/dist/core/AtomDisposableList";
import Bind from "@web-atoms/core/dist/core/Bind";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";
import { IDisposable } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { ChildEnumerator } from "@web-atoms/core/dist/web/core/AtomUI";
import PopupService from "@web-atoms/core/dist/web/services/PopupService";


export class BasePage extends AtomControl {

    public static encodeRoute(url: string) {
        return url;
    }

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

    public get route() {
        return this.routeUrl;
    }

    public set route(url: string) {
        if(!url) {
            return;
        }
        url = BasePage.encodeRoute(url);

        if (history.state?.url === url) {
            return;
        }

        const state = { url };
        history.pushState(state, "", url);
        const eventRegistration = (e: PopStateEvent) => {
            if (e.state === state) {
                this.cancel();
            }
        };
        window.addEventListener("popstate", eventRegistration);
        const d = {
            dispose() {
                window.removeEventListener("popstate", eventRegistration);
                if (history.state === state) {
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