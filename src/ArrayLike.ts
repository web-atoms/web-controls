export interface IArrayLike<T> {
    length: number;
    item(index: number): T;
}

export default class ArrayLike {
    public static *from<T>(item: IArrayLike<T>): IterableIterator<T> {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < item.length; i++) {
            const element = item[i];
            yield element;
        }
    }

    public static *fromWithIndex<T>(item: IArrayLike<T>): IterableIterator<{ index: number, element: T}> {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < item.length; index++) {
            const element = item[index];
            yield { index, element };
        }
    }

}
