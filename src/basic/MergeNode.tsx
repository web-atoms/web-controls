const empty = [];

export type IReplaceClass = string | {
    replace?: string,
    parent?: string,
    after?: string
};

export default class MergeNode {

    public static none() {
        return new MergeNode(empty);
    }

    public static childSelector(name: string, p?: { after?: string, parent?: string }) {
        if (p !== void 0) {
            const { parent, after } = p;
            return new MergeNode([{ replace: "* > " + name, parent, after }]);
        }
        return new MergeNode(["* > " + name]);
    }

    public static nestedSelector(name: string, p?: { after?: string, parent?: string }) {
        if (p !== void 0) {
            const { parent, after } = p;
            return new MergeNode([{ replace: "* " + name, parent, after }]);
        }
        return new MergeNode(["* " + name]);
    }

    private constructor(public classes: IReplaceClass[] = empty) {
    }

    public childSelector(name: string, p?: { after?: string, parent?: string }) {
        if (p !== void 0) {
            const { parent, after } = p;
            return new MergeNode([ ... this.classes, { replace: "* > " + name, parent, after }]);
        }
        return new MergeNode([... this.classes, "* > " + name]);
    }

    public nestedSelector(name: string, p?: { after?: string, parent?: string }) {
        if (p !== void 0) {
            const { parent, after } = p;
            return new MergeNode([ ... this.classes, { replace: "* " + name, parent, after }]);
        }
        return new MergeNode([... this.classes, "* " + name]);
    }

}
