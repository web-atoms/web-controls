import { ChildEnumerator, descendentElementIterator } from "@web-atoms/core/dist/web/core/AtomUI";

export const checkAnyParent = (check: (e: HTMLElement) => boolean) => (e: HTMLElement) => {
    while (e) {
        if (check(e)) {
            return true;
        }
        e = e.parentElement;    
    }
    return false;
};

export interface IRangeUpdate {
    range: Range;
    check: (e: HTMLElement) => boolean;
    update: (e: HTMLElement, v?: any) => HTMLElement;
    value?: any;
}

export interface IRangeCommand {
    check: (e: HTMLElement) => boolean;
    update: (e: HTMLElement, v?: any) => HTMLElement;
    value?: any;
}

export default class RangeEditor {

    public static updateAttribute(range: Range, name: string, value: string, anyParent: boolean = true) {
        return this.updateRange({
            range,
            check: anyParent
                ? checkAnyParent((e) => e.getAttribute(name) === value)
                : (e) => e.getAttribute(name) === value,
            update: (e) => (e.setAttribute(name, value), e)
        })
    }

    public static checkRange(
        {
            range,
            check,
        }: IRangeUpdate
    ) {
        const root = range.startContainer.nodeType !== Node.ELEMENT_NODE
            ? range.startContainer.parentElement
            : range.startContainer as HTMLElement;
        return check(root);
    }


    public static updateRange(
        {
            range,
            check,
            update,
            value
        }: IRangeUpdate
    ) {
                
    }

}

const updateAttribute = (name: string, value: string, anyParent = true) => ({
    update: (e: HTMLElement, v = value) =>
        (e.setAttribute(name, v), e),
    check: anyParent
        ? checkAnyParent((e: HTMLElement) => e.getAttribute(name) === value)
        : (e: HTMLElement) => e.getAttribute(name) === value
});

const updateStyle = (name: keyof CSSStyleDeclaration, value: string, anyParent = true) => ({
    update: (e: HTMLElement, v = value) =>
        (e.style[name as any] = v, e),
    check: anyParent
        ? checkAnyParent((e: HTMLElement) => e.style[name as any] === value)
        : (e: HTMLElement) => e.style[name as any] === value
});

export const RangeEditorCommands: Record<string, IRangeCommand> = {
    bold: updateStyle("fontWeight", "bold"),
    italic: updateStyle("fontStyle", "italic"),
    underline: updateStyle("textDecoration", "underline"),
    strikeThrough: updateStyle("textDecoration", "line-through"),
    foreColor: {
        check: () => false,
        update: (e, value) => {
            e.style.color = value;
            return e;
        }
    },
    removeFormat: {
        check: () => false,
        update: (e) => {
            e.removeAttribute("style");
            return e;
        }
    }
};
