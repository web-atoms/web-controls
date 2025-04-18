const getContainingBlock = (node: HTMLElement) => {

    if (!node || !node.parentElement) {
        return document.body;
    }

    const cs = getComputedStyle(node);

    const position = cs.position;

    if (/^(static|relative|sticky)$/.test(position)) {
        return getContainingBlock(node.parentElement);
    }

    if (/^(absolute)$/.test(position)) {
        
    }

    switch(node.tagName) {

    }

    return null;
}

export default getContainingBlock;