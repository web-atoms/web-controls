const getScreenRect = (e: HTMLElement) => {
    const { left, top, height, width} = e.getBoundingClientRect();
    const right = visualViewport.width - left - width;
    const bottom = visualViewport.height - top - height;
    return { left, top, right, bottom, height, width };
};

export function relativeRect(e: HTMLElement, cb: HTMLElement) {

    const ebr = getScreenRect(e);
    // const cbr = getScreenRect(cb);

    const left = ebr.left; // - cbr.left;
    const top = ebr.top; // - cbr.top;

    const bottom = ebr.bottom; // - cbr.bottom;
    const right = ebr.right; // - cbr.bottom;

    const height = e.offsetHeight;
    const width = e.offsetWidth;

    return { left, top, bottom, right, width, height, e };

}