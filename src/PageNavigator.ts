import { CancelToken } from "@web-atoms/core/dist/core/types";
import type { ContentPage } from "./mobile-app/MobileApp";

export default class PageNavigator {

    public static openPage<T>(page: typeof ContentPage<T, any>, parameters?: T, clearHistory?: boolean): void;
    public static openPage(
        page: string | any,
        parameters: {[key: string]: any} = {},
        clearHistory: boolean = true) {
        this.pushPageForResult(page, parameters, clearHistory).catch((e) => {
            if (!CancelToken.isCancelled(e)) {
                // tslint:disable-next-line: no-console
                console.error(e);
            }
        });
    }

    public static pushPage<T>(page: typeof ContentPage<T, any>, parameters?: T, clearHistory?: boolean);
    public static pushPage(
        page: string | any,
        parameters: {[key: string]: any} = {},
        clearHistory: boolean = false) {
        this.pushPageForResult(page, parameters, clearHistory).catch((e) => {
            if (!CancelToken.isCancelled(e)) {
                // tslint:disable-next-line: no-console
                console.error(e);
            }
        });
    }

    public static pushPageForResult<T, TResult>(
        page: typeof ContentPage<T, TResult>, parameters?: T, clearHistory?: boolean): Promise<TResult>;
    public static async pushPageForResult<T>(
        page: string | any,
        parameters: {[key: string]: any} = {},
        clearHistory: boolean = false): Promise<any> {
        return null;
    }

}
