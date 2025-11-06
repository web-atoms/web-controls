export const Focusable = {

    moveNext(currentElement: HTMLElement) {
        const focusableElements = Array.from(document.querySelectorAll('input, textarea, button, a[href], [tabindex]:not([tabindex="-1"])'));
        const currentIndex = focusableElements.indexOf(currentElement);
        const nextIndex = (currentIndex + 1) % focusableElements.length; // Loop back to the start if at the end
        const nextElement = focusableElements[nextIndex];
        if (!nextElement) {
            return;
        }
        (nextElement as any).focus();
    }

};