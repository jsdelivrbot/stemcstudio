declare class Two {
    type: string;
    frameCount: number;
    timeDelta: number;
    width: number;
    height: number;
    playing: boolean;
    renderer: Two.Types;
    scene: Two.Group;
    constructor(params?: TwoConstructionParams);
    /**
     * A convenient method to append the instance's dom element to the page.
     * It's required to add the instance's dom element to the page in order to see anything drawn.
     */
    appendTo(domElement: HTMLElement): Two;

    /**
     * Draws a line between two coordinates to the instance's drawing space where
     * x1, y1 are the x, y values for the first coordinate and x2, y2 are the x, y values for the second coordinate.
     */
    makeLine(x1: number, y1: number, x2: number, y2: number): Two.Line;
    makeRectangle(x: number, y: number, width: number, height: number): Two.Shape;
    makeCircle(x: number, y: number, radius: number): Two.Shape;
    makeEllipse(x: number, y: number, width: number, height: number): Two.Shape;

    makeCurve(x1: number, y1: number, open: boolean): Two.Shape;
    makeCurve(x1: number, y1: number, x2: number, y2: number, open: boolean): Two.Shape;
    makeCurve(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, open: boolean): Two.Shape;

    makePolygon(x1: number, y1: number, x2: number, y2: number, open: boolean): Two.Polygon;
    makeGroup(...objects): Two.Group;

    bind(event: string, callback: (arg?: Array<any>) => void): Two;
    unbind(event: string, callback: (arg?: Array<any>) => void): Two;

    /**
     * This method adds the instance to the requestAnimationFrame loop.
     * In affect enabling animation for this instance.
     */
    play();

    /**
     * This method removes the instance from the requestAnimationFrame loop.
     * In affect halting animation for this instance.
     */
    pause();

    /**
     * This method updates the dimensions of the drawing space, increments the tick for animation, and finally calls two.render().
     * When using the built-in requestAnimationFrame hook, two.play(), this method is invoked for you automatically.
     */
    update();

    /**
     * This method makes the instance's renderer draw.
     * It should be unnecessary to invoke this yourself at anytime.
     */
    render();

    /**
     * Add one or many shapes / groups to the instance.
     * Objects can be added as arguments, two.add(o1, o2, oN), or as an array depicted above.
     */
    add(...objects);

    /**
     * Remove one or many shapes / groups from the instance.
     * Objects can be removed as arguments, two.remove(o1, o2, oN), or as an array depicted above.
     */
    remove(...objects);

    /**
     * Removes all objects from the instance's scene.
     * If you intend to have the browser garbage collect this, don't forget to delete the references in your application as well.
     */
    clear();

}

declare module Two {
    enum Types {
        webgl,
        svg,
        canvas,
    }

    enum Events {
        play,
        pause,
        update,
        render,
        resize,
        change,
        remove,
        insert,
    }

    class Vector {
        x: number;
        y: number;
        set(x: number, y: number);
    }

    class LogicalShape {
        translation: Two.Vector;
        rotation: number; // radians
        scale: number;

        visible: boolean;

        parent: Two.Group;
        vertices: Collection;
    }

    export class Shape extends LogicalShape {
        parent: Two.Group;

        stroke: string; // color
        fill: string; // color
        linewidth: number;
        opacity: number; // 0-1

        /** http://www.w3.org/TR/SVG/images/painting/linecap.svg */
        cap: string;
        /** http://www.w3.org/TR/SVG/images/painting/linejoin.svg */
        join: string;
        miter: number;

        noStroke();
        noFill();
        subdivide();
    }

    class Line extends LogicalShape {

    }

    class Polygon extends Shape {
        vertices: Collection;
    }

    class Group extends LogicalShape {
        children: Array<any>;
        linewidth: number;
    }

    interface Collection extends Array<any> {

    }
}

interface TwoConstructionParams {
    type?: Two.Types;
    width?: number;
    height?: number;
    autostart?: boolean;
    fullscreen?: boolean;
    ratio?: number;
}