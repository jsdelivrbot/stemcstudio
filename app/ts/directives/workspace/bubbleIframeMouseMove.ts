// The iframe will capture the mouse events that we need to
// resize the output widow. This function
export default function bubbleIframeMouseMove(iframe: HTMLIFrameElement) {
    // Save any previous onmousemove handler.
    // We're taking abit of a chance here by casting away the requirement that this ave type Window.
    const existingOnMouseMove: (this: void, event: MouseEvent) => any = <any>iframe.contentWindow.onmousemove;

    // Attach a new onmousemove listener.
    iframe.contentWindow.onmousemove = function (this: void, e: MouseEvent) {
        // Fire any existing onmousemove listener.
        if (existingOnMouseMove) existingOnMouseMove(e);

        // Create a new event for the this window.
        const evt: MouseEvent = document.createEvent("MouseEvents");

        // We'll need this to offset the mouse move appropriately.
        const boundingClientRect = iframe.getBoundingClientRect();

        // Initialize the event, copying exiting event values (most of them).
        evt.initMouseEvent(
            "mousemove",
            true, // bubbles
            false, // not cancelable 
            window,
            e.detail,
            e.screenX,
            e.screenY,
            e.clientX + boundingClientRect.left,
            e.clientY + boundingClientRect.top,
            e.ctrlKey,
            e.altKey,
            e.shiftKey,
            e.metaKey,
            e.button,
            null // no related element
        );

        // Dispatch the mousemove event on the iframe element.
        iframe.dispatchEvent(evt);
    };
}
