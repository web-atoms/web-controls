const empty = [];

export type IReplaceClass = string | { replace?: string, parent?: string };

export default class MergeNode {

    public static none() {
        return new MergeNode(empty);
    }

    public static childSelector(name: string, parent?: string) {
        if (parent !== void 0) {
            return new MergeNode([{ replace: "* > " + name, parent }]);
        }
        return new MergeNode(["* > " + name]);
    }

    private constructor(public classes: IReplaceClass[] = empty) {
    }

    public childSelector(name: string, parent?: string) {
        if (parent !== void 0) {
            return new MergeNode([ ... this.classes, { replace: "* > " + name, parent }]);
        }
        return new MergeNode([... this.classes, "* > " + name]);
    }
}
