import { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import { ContentPage } from "./MobileApp";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";

export const isMobileView = /Android|iPhone/i.test(navigator.userAgent) && (Math.min(window.visualViewport.width, window.visualViewport.height) < 500);

const root = (isMobileView ? ContentPage : PopupWindow) as typeof AtomControl;

export default class PopupWindowPage<TIn = any, TOut = any> extends (root) {


    public parameters: TIn;

    public close: (r: TOut) => void;

    public title: string;

}