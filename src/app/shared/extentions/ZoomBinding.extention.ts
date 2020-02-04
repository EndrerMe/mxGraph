export class ZoomBinding {
    public static BindZoomToElement(element: HTMLElement | Document, graph): void {
        const zoom = (e): void => {
            const delta = ((e.deltaY || -e.wheelDelta || e.detail) >> 10) || 1;

            if (delta === -1) {
                graph.zoomIn();
            }
            if (delta === 1) {
                graph.zoomOut();
            }
        };

        element.addEventListener('mousewheel', (e) => {
            zoom(e);
        });

        element.addEventListener('wheel', (e) => {
            zoom(e);
        });

        element.addEventListener('DOMMouseScroll', (e) => {
            zoom(e);
        });

        element.addEventListener('DOMMouseScroll', (e) => {
            zoom(e);
        });
    }
}
