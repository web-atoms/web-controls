
export default class MergeNode {

    public static create() {
        return new MergeNode();
    }

    private constructor(public classes: string[] = []) {
    }

    public childClass(name: string) {
        return new MergeNode([...this.classes, "* > ." + name]);
    }

    public childElement(name: string) {
        return new MergeNode([...this.classes, "* > " + name]);
    }

    public childData(name: string, value?: string) {
        if (value) {
            return new MergeNode([...this.classes, `* > [${name}="${value}"]`]);
        }
        return new MergeNode([...this.classes, `* > [${name}]`]);
    }
}
