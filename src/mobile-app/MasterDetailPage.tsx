import PageNavigator, { Page } from "../PageNavigator";
import { ContentPage, isMobileView } from "./MobileApp";
import { descendentElementIterator } from "@web-atoms/core/dist/web/core/AtomUI";
import AtomRepeater from "../basic/AtomRepeater";

import "./master-detail.global.less";


const findItem = (content: Element, item) => {
    for (const iterator of descendentElementIterator(content)) {
        const repeater = (iterator as HTMLElement)?.atomControl;
        if (!(repeater instanceof AtomRepeater)) {
            continue;
        }
        const index = repeater.items?.indexOf(item) ?? -1;
        if (index === -1) {
            continue;
        }
        const element = repeater.element?.querySelector(`[data-item-index="${index}"]`);
        if (element) {
            return element;
        }
    }
};

export default class MasterDetailPage<T = any, TResult = any> extends ContentPage<T, TResult> {

    public showClose = true;

    public scrollEveryNewTarget = false;

    public lookupItemForHighlight = true;

    private highlightAttributeValue: [string, string] = ["data-filter", "drop-shadow-accent"];
    public get highlightAttribute() {
        return this.highlightAttributeValue;
    }
    public set highlightAttribute(value: string | [string, string]) {
        if(!value) {
            this.highlightAttributeValue = ["data-filter", "drop-shadow-accent"];
            return;
        }
        if (typeof value === "string") {
            const tokens = value.split("=");
            let key = tokens[0];
            let v = tokens[1] ?? "true";
            if(v.endsWith("]")) {
                v = v.substring(0, v.length - 1);
            }
            if (key.startsWith("[")) {
                key = key.substring(1);
            }
            value = [key, v];
        }
        this.highlightAttributeValue = value;
    }

    private lastTargetElement: HTMLElement;

    private lastDetail: ContentPage;

    private closeButton: HTMLElement;

    /**
     * 
     * @param page Page to open in detail view
     * @param parameters Parameters required to create the page
     * @param highlightElement element to highlight and will be brought into view after details is created
     * @returns 
     */
    public openDetail<T>(
        page: Page<T>,
        parameters: T,
        highlightElementOrItem?: HTMLElement | any) {
        if (isMobileView) {
            PageNavigator.pushPage(page, parameters);
            return;
        }

        const content = this.element.querySelector(`[data-page-element="content"]`);
        content.setAttribute("data-mode", "desktop");

        let highlightElement;
        if (highlightElementOrItem instanceof HTMLElement) {
            highlightElement = highlightElementOrItem;
        }

        if(!highlightElement && this.lookupItemForHighlight) {
            highlightElement = findItem(content, highlightElementOrItem);
        }

        const lastTargetElement = this.lastTargetElement;
        if (lastTargetElement) {
            const [key] = this.highlightAttributeValue;
            lastTargetElement.removeAttribute(key);
        }
        this.lastTargetElement = highlightElement;

        if (!this.closeButton && this.showClose) {
            const closeButton = document.createElement("i");
            closeButton.setAttribute("data-element", "close");
            closeButton.className = "fas fa-times-circle";
            this.closeButton = closeButton;
            content.appendChild(closeButton);            
            closeButton.addEventListener("click", () => this.closeDetail());
        }

        let lastDetail = this.lastDetail;
        if (lastDetail) {
            const { element } = lastDetail;
            lastDetail.dispose();
            element.remove();
            if (this.scrollEveryNewTarget) {
                this.scrollTargetIntoView();
            }
        } else {
            this.scrollTargetIntoView();
        }
        
        this.updateTargetSelector(highlightElement);   

        const P = page;
        lastDetail = new P(this.app);
        content.appendChild(lastDetail.element);
        lastDetail.element.setAttribute("data-element", "detail");
        this.lastDetail = lastDetail;
        lastDetail.parameters = parameters;
        const close = () => this.closeDetail();
        lastDetail.cancel = close;
        lastDetail.close = close;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.app.runAsync(() => this.lastDetail?.init?.());
    }

    protected scrollTargetIntoView(dispose = false) {
        const lastTargetElement = this.lastTargetElement;
        if (lastTargetElement) {
            setTimeout(() => {
                if (lastTargetElement.isConnected) {
                    lastTargetElement.scrollIntoView();
                }
                if (dispose) {
                    this.lastTargetElement = void 0;
                    this.updateTargetSelector(lastTargetElement, true, dispose);
                }
            }, 100);
        }
    }

    protected updateTargetSelector(lastTargetElement: HTMLElement, remove = false, delay = false) {
        if (!lastTargetElement) {
            return;
        }
        const [key, value] = this.highlightAttributeValue;
        if (remove) {
            if (delay) {
                setTimeout(() => {
                    lastTargetElement.removeAttribute(key);
                }, 1000);
            } else {
                lastTargetElement.removeAttribute(key);
            }
            return;
        }        
        lastTargetElement.setAttribute(key, value);
    }

    protected preCreate(): void {
        super.preCreate();
        this.element.setAttribute("data-page-type", "master-detail");
    }

    protected closeDetail() {
        const lastDetail = this.lastDetail;
        if (lastDetail) {
            const { element } = lastDetail;
            lastDetail.dispose();
            element.remove();
            this.lastDetail = void 0;
        }
        const closeButton = this.closeButton;
        if (closeButton) {
            closeButton.remove();
            this.closeButton = void 0;
        }
        const content = this.element.querySelector(`[data-page-element="content"]`);
        content.removeAttribute("data-mode");
        this.scrollTargetIntoView(true);
    }
}
