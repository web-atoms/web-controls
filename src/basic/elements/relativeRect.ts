const getScreenRect = (e: HTMLElement) => {
    const { left, top, height, width} = e.getBoundingClientRect();
    const right = visualViewport.width - left - width;
    const bottom = visualViewport.height - top - height;
    return { left, top, right, bottom, height, width };
};

export function relativeRect(e: HTMLElement, cbr: DOMRect, cb) {

    const ebr = getScreenRect(e);

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