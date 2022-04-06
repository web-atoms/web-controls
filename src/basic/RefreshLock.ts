import { App } from "@web-atoms/core/dist/App";
import { IDisposable } from "@web-atoms/core/dist/core/types";

export default class RefreshLock implements IDisposable {

    public dispose;

    private promise;

    private map = new Map<number, any>();

    constructor(private app: App, e: HTMLElement) {

        e.addEventListener("refreshLockBegin", this.begin);
        e.addEventListener("refreshLockEnd", this.end);

        this.dispose = () => {
            e.removeEventListener("refreshLockBegin", this.begin);
            e.removeEventListener("refreshLockEnd", this.begin);
        };
    }

    public queue(fx: (... a: any) => any) {
        if (this.promise) {
            this.promise.then(fx);
            return;
        }
        fx();
    }

    private begin = (ce: CustomEvent) => {
        if (ce.target === ce.currentTarget) {
            return;
        }
        const previous = this.promise;
        this.promise = this.setupNew(previous, ce.detail.id);
        this.app.runAsync(() => this.promise);
    }

    private end = (ce: CustomEvent) => {
        if (ce.target === ce.currentTarget) {
            return;
        }
        const resolver = this.map.get(ce.detail.id);
        resolver?.();
    }

    private async setupNew(previous: any, id: any) {
        if (previous) {
            await previous;
        }
        await new Promise((resolve, reject) => {
            this.map.set(id, resolve);
        });
        this.map.delete(id);
        this.promise = null;
    }
}
