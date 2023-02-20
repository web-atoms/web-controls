const empty = [];

export default class MergeNode {

    public static childSelector(name: string) {
        return new MergeNode(["* > " + name]);
    }

    private constructor(public classes: string[] = empty) {
    }

    public childSelector(name: string) {
        return new MergeNode([... this.classes, "* > " + name]);
    }
}
