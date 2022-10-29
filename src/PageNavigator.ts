import { CancelToken } from "@web-atoms/core/dist/core/types";

export default class PageNavigator {

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

    public static async pushPageForResult<T>(
        page: string | any,
        parameters: {[key: string]: any} = {},
        clearHistory: boolean = false) {
        return null;
    }

}
