const empty = [];

export type IReplaceClass = string | { replace?: string, parent?: string };

export default class MergeNode {

    public static none() {
        return new MergeNode(empty);
    }

    public static childSelector(name: string) {
        return new MergeNode(["* > " + name]);
    }

    private constructor(public classes: IReplaceClass[] = empty) {
    }

    public childSelector(name: string) {
        return new MergeNode([... this.classes, "* > " + name]);
    }
}
