import { CancelToken } from "@web-atoms/core/dist/core/types";
import type { ContentPage } from "./mobile-app/MobileApp";
import { PageCommands } from "@web-atoms/core/dist/core/Command";

export type Page<T> = typeof ContentPage<T, any>;
export type PageWith<T, T2> = typeof ContentPage<T, T2>;

export default class PageNavigator {

    public static openPage<T>(page: Page<T>, parameters?: T, clearHistory?: boolean): void;
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

    public static pushPage<T>(page: Page<T>, parameters?: T, clearHistory?: boolean);
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
        page: PageWith<T, TResult>, parameters?: T, clearHistory?: boolean): Promise<TResult>;
    public static async pushPageForResult(
        page: string | any,
        parameters: {[key: string]: any} = {},
        clearHistory: boolean = false): Promise<any> {
        return null;
    }

    public static pushPageForResultOrCancel<T, TResult>(
        page: PageWith<T, TResult>, parameters?: T, clearHistory?: boolean): Promise<TResult | undefined> {
        try {
            return this.pushPageForResult(page, parameters);
        } catch (e) {
            if (CancelToken.isCancelled(e)) {
                return;
            }
            console.error(e);
            return;
        }
    }

}

PageCommands.openPage = (c, p) => PageNavigator.openPage(c, p);
PageCommands.pushPage = (c, p) => PageNavigator.pushPage(c, p);
PageCommands.pushPageForResult = (c, p) => PageNavigator.pushPageForResult(c, p);
