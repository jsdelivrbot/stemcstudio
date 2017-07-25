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
    makeRectangle(x: number, y: number, width: number, height: number): Two.Rectangle;
    makeCircle(x: number, y: number, radius: number): Two.Path;
    makeEllipse(x: number, y: number, width: number, height: number): Two.Path;

    makeCurve(x1: number, y1: number, open: boolean): Two.Path;
    makeCurve(x1: number, y1: number, x2: number, y2: number, open: boolean): Two.Path;
    makeCurve(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, open: boolean): Two.Path;

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
        clear(): this;
        /**
         * 
         */
        clone(): Vector;
        /**
         * Set the x, y properties of the vector from another vector, v.
         */
        copy(v: Vector): this;
        /**
         * Set the x, y properties of the vector to the arguments x, y.
         */
        set(x: number, y: number): this;
        /**
         * Add to vectors together.
         * The sum of the x, y values will be set to the instance.
         */
        add(v1: Vector, v2: Vector): this;
        /**
         * Add the x, y values of the instance to the values of another vector.
         * Set the sum to the instance's values.
         */
        addSelf(v: Vector): this;
        /**
         * Subtract two vectors.
         * Set the difference to the instance.
         */
        sub(v1: Vector, v2: Vector): this;
        /**
         * Subtract a vector, v, from the instance.
         */
        subSelf(v: Vector): this;
        /**
         * Multiply the x, y values of the instance by another vector's, v, x, y values.
         */
        multiplySelf(v: Vector): this;
        /**
         * Multiply the x, y values of the instance by another number, value.
         */
        multiplyScalar(value: number): this;
        /**
         * Divide the x, y values of the instance by another number, value.
         */
        divideScalar(value: number): this;
        /**
         * Toggle the sign of the instance's x, y values.
         */
        negate(): this;
        /**
         * Return the dot product of the instance and a vector, v.
         */
        dot(v: Vector): number;
        /**
         * 
         */
        lengthSquared(): number;
        /**
         * 
         */
        length(): number;
        /**
         * 
         */
        normalize(): this;
        /**
         * Return the distance from the instance to another vector, v.
         */
        distanceTo(v: Vector): number;
        /**
         * Return the distance squared from the instance to another vector, v.
         */
        distanceToSquared(v: Vector): number;
        /**
         * Set the length of a vector to a specified distance, length.
         */
        setLength(length: number): this;
        /**
         * Return a boolean representing whether or not the vectors are within 0.0001 of each other.
         * This fuzzy equality helps with Physics libraries.
         */
        equals(v: Vector): boolean;
        /**
         * Linear interpolation of the instance's current x, y values to the destination vector, v, by an amount, t.
         * Where t is a value 0-1.
         */
        lerp(v: Vector, t: number): this;
        /**
         * Returns a boolean describing the length of the vector less than 0.0001.
         */
        isZero(): boolean;
        toString(): string;
        toObject(): { x: number; y: number };
    }

    class Anchor extends Vector {
        constructor(x: number, y: number, lx: number, ly: number, rx: number, ry: number);
        clone(): Anchor;
    }

    class Shape {
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
        /**
         * A reference to the group that contains this instance.
         */
        parent: Group;
        /**
         * A collection of anchors that is two-way databound.
         * Individual vertices may be manipulated.
         */
        vertices: Collection;
    }

    class Path extends Shape {
        /**
         * The id of the path.
         * In the svg renderer this is the same number as the id attribute given to the corresponding node.
         * i.e: if path.id = 4 then document.querySelector('#two-' + group.id) will return the corresponding svg node.
         */
        id: string;
        /**
         * A string representing the color for the stroke of the path.
         * All valid css representations of color are accepted.
         */
        stroke: string;

        /**
         * A string representing the color for the area of the vertices.
         * All valid css representations of color are accepted.
         */
        fill: string;

        /**
         * A number representing the thickness the path's strokes.
         * Must be a positive number.
         */
        linewidth: number;

        /**
         * A number representing the opacity of the path.
         * Use strictly for setting.
         * Must be a number 0-1.
         */
        opacity: number;

        /**
         * A string representing the type of stroke cap to render.
         * All applicable values can be found on the w3c spec.
         * Defaults to "round".
         */
        cap: string;

        /**
         * A string representing the type of stroke join to render.
         * All applicable values can be found on the w3c spec.
         * Defaults to "round".
         */
        join: string;

        /**
         * A number representing the miter limit for the stroke.
         * Defaults to 1.
         */
        miter: number;

        /**
         * Boolean that describes whether the path is closed or not.
         */
        closed: boolean;

        /**
         * Boolean that describes whether the path is curved or not.
         */
        curved: boolean;

        /**
         * Boolean that describes whether the path should automatically dictate how anchors behave.
         * This defaults to true.
         */
        automatic: boolean;

        /**
         * A number, 0-1, that is mapped to the layout and order of vertices.
         * It represents which of the vertices from beginning to end should start the shape.
         * Exceedingly helpful for animating strokes.
         * Defaults to 0.
         */
        beginning: number;

        /**
         * A number, 0-1, that is mapped to the layout and order of vertices.
         * It represents which of the vertices from beginning to end should end the shape.
         * Exceedingly helpful for animating strokes.
         * Defaults to 1.
         */
        ending: number;

        /**
         * Returns a new instance of a Path with the same settings.
         */
        clone(): Path;

        /**
         * Anchors all vertices around the centroid of the group.
         */
        center(): void;

        /**
         * Adds the instance to a Group.
         */
        addTo(group: Group): void;

        /**
         * 
         */
        remove(): void;

        /**
         * Returns an object with top, left, right, bottom, width, and height parameters representing the bounding box of the path.
         * Pass true if you're interested in the shallow positioning,
         * i.e in the space directly affecting the object and not where it is nested.
         */
        getBoundingClientRect(shallow?: boolean): { top: number; left: number; right: number; bottom: number; width: number; height: number };

        /**
         * Removes the fill.
         */
        noFill(): this;

        /**
         * Removes the stroke.
         */
        noStroke(): this;

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

    class Line extends Path {
        /**
         * A line takes two sets of x, y coordinates.
         * x1, y1 to define the left endpoint and x2, y2 to define the right endpoint.
         */
        constructor(x1: number, y1: number, x2: number, y2: number);
    }

    class Rectangle extends Path {
        /**
         * A rectangle takes a set of x, y coordinates as its origin
         * (the center of the rectangle by default) and width,
         * height parameters to define the width and height of the rectangle.
         */
        constructor(x: number, y: number, width: number, height: number);
    }

    class RoundedRectangle extends Path {
        /**
         * A rounded rectangle takes a set of x, y coordinates as its origin
         * (the center of the rounded rectangle by default) and width,
         * height parameters to define the width and height of the rectangle.
         * Lastly, it takes an optional radius number representing the radius of the curve along the corner of the rectangle.
         * radius defaults to 1/12th the of the smaller value between width, height.
         */
        constructor(x: number, y: number, width: number, height: number, radius?: number);
    }

    class Ellipse extends Path {
        /**
         * An ellipse takes a set of x, y coordinates as its origin
         * (the center of the ellipse by default) and width,
         * height parameters to define the width and height of the ellipse.
         */
        constructor(x: number, y: number, width: number, height: number);
    }

    class Star extends Path {
        /**
         * 
         */
        constructor(x: number, y: number, or: number, ir?: number, sides?: number);
    }

    class Polygon extends Path {
        vertices: Collection;
        /**
         * A polygon takes a set of x, y coordinates as its origin
         * (the center of the polygon by default) and
         * radius, sides parameters to define the radius of the polygon and how many sides the polygon has.
         * By default there are 3 sides, a triangle.
         */
        constructor(x: number, y: number, radius: number, sides: number);
    }

    /**
     * This is a container object for two.js — it can hold shapes as well as other groups.
     * At a technical level it can be considered an empty transformation matrix.
     * It is recommended to use two.makeGroup() in order to add groups to your instance of two, but it's not necessary.
     * Unless specified methods return their instance of Two.Group for the purpose of chaining.
     */
    class Group extends Shape {
        /**
         * The id of the group.
         * In the svg renderer this is the same number as the id attribute given to the corresponding node.
         * i.e: if group.id = 5 then document.querySelector('#two-' + group.id) will return the corresponding node.
         */
        id: string;
        stroke: string;
        fill: string;
        linewidth: number;
        opacity: number;
        cap: string;
        join: string;
        miter: number;
        children: Array<Shape>;
        mask: any;
        clone(): Group;
        center(): void;
        addTo(group: Group): void;
        add(objects: any): void;
        remove(object: any): void;
        getBoundingClientRext(): { top: number; left: number; right: number; bottom: number; width: number; height: number };
        noFill(): this;
        noStroke(): this;
    }

    class Text extends Shape {
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
        /**
         * A text object takes in a message, the string representation of what will be displayed.
         * It then takes an x and y number where the text object will be placed in the group.
         * Finally, an optional styles object to apply any other additional styles.
         * Applicable properties to affect can be found in Two.Text.Properties.
         */
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