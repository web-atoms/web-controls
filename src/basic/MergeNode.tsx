const empty = [];

export default class MergeNode {

    public static create() {
        return new MergeNode();
    }

    private constructor(public classes: string[] = empty) {
    }

    public childSelector(name: string) {
        return new MergeNode([... this.classes, "* > " + name]);
    }
}
