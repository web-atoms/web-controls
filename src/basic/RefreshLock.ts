import { IDisposable } from "@web-atoms/core/dist/core/types";

export default class RefreshLock implements IDisposable {

    public dispose;

    public promise;

    private map = new Map<number, any>();

    constructor(e: HTMLElement) {

        e.addEventListener("refreshLockBegin", this.begin);
        e.addEventListener("refreshLockEnd", this.end);

        this.dispose = () => {
            e.removeEventListener("refreshLockBegin", this.begin);
            e.removeEventListener("refreshLockEnd", this.begin);
        };
    }

    private begin = (ce: CustomEvent) => {
        const previous = this.promise;
        this.promise = this.setupNew(previous, ce.detail.id);
    }

    private end = (ce: CustomEvent) => {
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
    }
}
