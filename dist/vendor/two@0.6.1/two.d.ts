declare class Two {
    type: string;
    frameCount: number;
    timeDelta: number;
    width: number;
    height: number;
    playing: boolean;
    renderer: Two.Types;
    scene: Two.Group;
    /**
     * 
     */
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
    makeText(value: string, x: number, y: number, something: string): Two.Text;

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

    /**
     * This is the atomic coordinate representation for two.js.
     * A Two.Vector is different and specific to two.js because its main properties,
     * x and y, trigger events which allow the renderers to efficiently change only when they need to.
     * Unless specified methods return their instance of Two.Vector for the purpose of chaining.
     */
    class Vector {
        /**
         * The x value of the vector.
         */
        x: number;
        /**
         * The y value of the vector.
         */
        y: number;
        /**
         *
         */
        constructor(x: number, y: number);
        /**
         *  Set the x, y properties of the vector to zero.
         */
        clear(): void;
        /**
         * Set the x, y properties of the vector from another vector, v.
         */
        copy(v: Vector): void;
        /**
         * Set the x, y properties of the vector to the arguments x, y.
         */
        set(x: number, y: number): void;
    }

    class Anchor extends Vector {
        constructor(x: number, y: number, lx: number, ly: number, rx: number, ry: number);
        clone(): Anchor;
    }

    class LogicalShape {
        /**
         * A Vector that represents x, y translation of the shape in the drawing space.
         */
        translation: Vector;
        /**
         * A number that represents the rotation of the shape in the drawing space, in radians.
         */
        rotation: number;
        /**
         * A number that represents the uniform scale of the shapet in the drawing space.
         */
        scale: number;
        /**
         * A boolean representing whether the shape is visible or not.
         */
        visible: boolean;

        parent: Group;
        vertices: Collection;
    }

    class Shape extends LogicalShape {
        /**
         * 
         */
        stroke: string;

        /**
         * 
         */
        fill: string;

        /**
         * 
         */
        linewidth: number;

        /**
         * 
         */
        opacity: number;

        /**
         *
         */
        cap: string;

        /**
         *
         */
        join: string;

        /**
         * 
         */
        miter: number;

        /**
         * Removes the stroke.
         */
        noStroke(): this;
        /**
         * Removes the fill.
         */
        noFill(): this;
        /**
         * If curved, goes through the vertices and calculates the curve.
         * If not, then goes through the vertices and calculates the lines.
         */
        plot(): void;
        /**
         * Creates a new set of vertices that are lineTo anchors.
         * For previously straight lines the anchors remain the same.
         * For curved lines, however, subdivide is used to generate a new set of straight lines that are perceived as a curve.
         */
        subdivide(): void;
    }

    class Line extends LogicalShape {

    }

    class Polygon extends Shape {
        vertices: Collection;
    }

    /**
     * This is a container object for two.js — it can hold shapes as well as other groups.
     * At a technical level it can be considered an empty transformation matrix.
     * It is recommended to use two.makeGroup() in order to add groups to your instance of two, but it's not necessary.
     * Unless specified methods return their instance of Two.Group for the purpose of chaining.
     */
    class Group extends LogicalShape {
        id: string;
        stroke: string;
        fill: string;
        linewidth: number;
        opacity: number;
        cap: string;
        join: string;
        miter: number;
        children: Array<LogicalShape>;
        mask: any;
        clone(): Group;
        center(): void;
        addTo(group: Group): void;
        add(objects: any): void;
        remove(object: any): void;
        getBoundingClientRext(): { top: number, left: number, right: number, bottom: number };
        noFill(): this;
        noStroke(): this;
    }

    class Text extends LogicalShape {
        /**
         * A string representing the horizontal alignment to be applied to the rendered text. e.g: 'left', 'right', or 'center'.
         * Default value is 'middle'.
         */
        alignment: 'left' | 'right' | 'center' | 'middle';
        /**
         * A string representing the vertical aligment to be applied to the rendered text. e.g: 'middle', 'baseline', or 'top'.
         * Default value is 'middle'.
         */
        baseline: 'middle' | 'baseline' | 'top';
        /**
         * A string representing the text decoration to be applied to the rendered text. e.g: 'none', 'underlined', or 'strikethrough'.
         * Default value is 'none'
         */
        decoration: 'none' | 'underlined' | 'strikethrough';
        /**
         * A string representing the css font-family to be applied to the rendered text.
         * Default value is 'sans-serif'.
         */
        family: string;
        /**
         * A string representing the color for the text area to be filled. All valid css representations of color are accepted.
         * Default value is '#000'.
         */
        fill: string;
        /**
         * A number representing the leading, a.k.a. line-height, to be applied to the rendered text.
         * Default value is 17.
         */
        leading: number;
        /**
         * A number representing the linewidth to be applied to the rendered text.
         * Default value is 1.
         */
        linewidth: number;
        /**
         * A number representing the opacity of the path. Use strictly for setting.
         * Must be a number 0-1.
         */
        opacity: number;
        /**
         * A number representing the text's size to be applied to the rendered text.
         * Default value is 13.
         */
        size: number;
        /**
         * A string representing the color for the text area to be stroked. All valid css representations of color are accepted.
         * Default value is 'transparent'.
         */
        stroke: string;
        /**
         * A string representing the font style to be applied to the rendered text. e.g: 'normal' or 'italic'.
         * Default value is 'normal'.
         */
        style: 'normal' | 'italic';
        /**
         * A string representing the text that will be rendered to the stage.
         */
        value: string;
        /**
         * A boolean representing whether the text object is visible or not.
         */
        visible: boolean;
        /**
         * A number or string representing the weight to be applied to the rendered text. e.g: 500 or 'normal'.
         * For more information see the Font Weight Specification.
         * Default value is 500.
         */
        weight: number | string;
        constructor(message: string, x: number, y: number, styles: string);
        /**
         * Returns a new instance of a Two.Text with the same settings.
         */
        clone(): Text;
        /**
         * 
         */
        flagReset(): this;
        /**
         * Currently returns an empty object.
         * A shim for compatibility with matrix math in the various renderers.
         */
        getBoundingClientRect(): { top: number; left: number; right: number; bottom: number; width: number; height: number };
        /**
         * Removes the fill.
         */
        noFill(): this;
        /**
         * Removes the stroke.
         */
        noStroke(): this;
        /**
         * 
         */
        remove(): this;
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