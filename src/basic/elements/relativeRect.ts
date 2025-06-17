const getScreenRect = (e: HTMLElement, cbr: DOMRect = e.getBoundingClientRect()) => {
    const { left, top, height, width} = cbr;
    const right = visualViewport.width - left - width;
    const bottom = visualViewport.height - top - height;
    return { left, top, right, bottom, height, width };
};

export function relativeRect(e: HTMLElement, cb) {

    const ebr = getScreenRect(e);
    const cbr = getScreenRect(cb);

    let left = ebr.left; // - cbr.left;
    let top = ebr.top; // - cbr.top;


    let bottom = ebr.bottom; // - cbr.bottom;
    let right = ebr.right; // - cbr.bottom;

    if (cb.offsetParent) {
        left -= cbr.left;
        top -= cbr.top;
        bottom -= cbr.bottom;
        right -= cbr.right;
    }

    const height = e.offsetHeight;
    const width = e.offsetWidth;

    return { left, top, bottom, right, width, height, e };

}