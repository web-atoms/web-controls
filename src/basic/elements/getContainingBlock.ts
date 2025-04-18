const getContainingBlock = (node: HTMLElement) => {

    if (!node || !node.parentElement) {
        return document.body;
    }

    let start = node.parentElement;
    while (start) {
    
        const cs = getComputedStyle(start);
        if(cs.filter !== "none") {
            return start;
        }
        if (cs.backdropFilter !== "none") {
            return start;
        }

        if (cs.transform !== "none") {
            return start;
        }
        if (cs.perspective !== "none")  {
            return start;
        }
        if (/layout|paint|strict|content/i.test(cs.contain)) {
            return start;
        }
        if (cs.containerType && cs.containerType !== "normal") {
            return start;
        }
        if (/filter|transform/i.test(cs.willChange)) {
            return start;
        }
        if (/auto/i.test(cs.contentVisibility)) {
            return start;
        }
    
        start = start.parentElement;
    }

    return document.body;
}

export default getContainingBlock;