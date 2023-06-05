import XNode from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import PageNavigator, { Page } from "../PageNavigator";
import { ContentPage, isMobileView } from "./MobileApp";

    styled.css `
        & > [data-page-element=content] {
            display: grid;
            & > * {
                grid-row: 1;
                grid-column: 1;
                align-self: stretch;
                justify-self: stretch;
            }
            & > *[data-element=detail] {
                display: none;
            }
            &[data-mode=desktop] {
                display: grid;
                grid-template-columns: 5fr minmax(400px, 3fr) auto;
                grid-template-rows: auto 1fr;
                & > *{
                    grid-row: 1 / span 2;
                    grid-column: 1;
                }
                & > *[data-element=close] {
                    grid-row: 1;
                    grid-column: 3;
                    color: red;
                    margin-top: 0.35em;
                    padding: 5px;
                    align-self: center;
                    justify-self: center;
                    font-size: 1.5em;
                    z-index: 2;
                }
                & > *[data-element=detail] {
                    grid-row: 1 / span 2;
                    grid-column: 2 / span 2;
                    align-self: stretch;
                    justify-self: stretch;
                    transform: none;
                    transition: none;
                    display: grid;
                    position: relative;
                    margin: 5px;
                    border-radius: 9px;
                    box-shadow: rgb(50 50 105 / 7%) 0px 2px 5px 0px, rgb(0 0 0 / 3%) 0px 1px 1px 0px;
                    border: solid 1px rgb(217 217 217);
                    padding: 0;
                    & > [data-page-element=header] {
                        grid-column: 1 / span 3;
                    }
                    & > [data-page-element=footer] {
                        grid-column: 1 / span 3;
                    }
                    & > [data-page-element=content] {
                        grid-column: 1 / span 3;
                    }
                }
            }
        }
    `.installGlobal("[data-page-type=master-detail]");

export default class MasterDetailPage extends ContentPage {

    public showClose = true;

    private lastDetail: ContentPage;

    private closeButton: HTMLElement;

    public openDetail<T>(page: Page<T>, parameters: T) {
        if (isMobileView) {
            PageNavigator.pushPage(page, parameters);
            return;
        }

        const content = this.element.querySelector(`[data-page-element="content"]`);
        content.setAttribute("data-mode", "desktop");

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
        }
        const P = page;
        lastDetail = new P(this.app);
        content.appendChild(lastDetail.element);
        lastDetail.element.setAttribute("data-element", "detail");
        this.lastDetail = lastDetail;
        lastDetail.parameters = parameters;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.app.runAsync(() => this.lastDetail?.init?.());
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
    }
}
