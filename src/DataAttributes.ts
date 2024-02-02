export default class DataAttributes {

    public static from(e: any, till: any) {
        return new DataAttributes(e, till);
    }

    constructor(
        private element: HTMLElement,
        private till: any
    ) {

    }

    get(name: string) {
        let start = this.element;
        const till = this.till;
        while(start && start !== till) {
            const a = start.getAttribute(name);
            if (a) {
                return a;
            }
            start = start.parentElement;
        }
    }

}