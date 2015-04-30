//
// Copyright 2015 David Holmes, https://github.com/geometryzen
//
/**
 * JXG namespace.
 */
declare module JXG {
    /**
     * Converts HSV color to RGB color. Based on C Code in "Computer Graphics -- Principles and Practice," Foley et al, 1996, p. 593. See also http://www.efg2.com/Lab/Graphics/Colors/HSV.htm 
     * @param H value between 0 and 360
     * @param S value between 0.0 (shade of gray) to 1.0 (pure color)
     * @param V value between 0.0 (black) to 1.0 (white)
     * @return RGB color string
     */
    export function hsv2rgb(H: number, S: number, V: number): string;
    /**
     * This is the basic class for geometry elements like points, circles and lines. 
     */
    export interface GeometryElement {
        /**
         * Returns the element name.
         */
        getName(): string;
        /**
         * Hide the element. It will still exist but not visible on the board.
         */
        hideElement(): void;
        /**
         * Register a new event handler.
         * For a list of possible events see documentation of the elements and objects implementing the EventEmitter interface. 
         * @param event
         * @param handler
         * @param context The context the handler will be called in, default is the element itself.
         */
        on(event: string, handler: ()=>void, context?: {}): void;
        /**
         * Sets an arbitrary number of attributes.
         * @param attributes An object with attributes.
         */
        setAttribute(attributes: {}): void;
        /**
         * Updates the element's label text, strips all html.
         * @param text The element label text.
         */
        setLabelText(text: string): string;
        /**
         * Updates the element's label text and the element's attribute "name", strips all html.
         * @param name The element name.
         */
        setName(name: string): string;
        /**
         * Make the element visible.
         */
        showElement(): void;
    }
    /**
     *
     */
    export interface CoordsElement extends GeometryElement {
        /**
         * Getter method for x, this is used by for CAS-points to access point coordinates.
         */
        X(): number;
        /**
         * Getter method for y, this is used by for CAS-points to access point coordinates.
         */
        Y(): number;
        /**
         * Starts an animated point movement towards the given coordinates where.
         * The animation is done after time milliseconds.
         * If the second parameter is not given or is equal to 0, setPosition() is called, see #setPosition.
         * @param where Array containing the x and y coordinate of the target location.
         * @param time Number of milliseconds the animation should last.
         * @param options
         */
        moveTo(where: number[], time?: number, options?: {callback?: ()=>void; effect?: string;}): Point;
    }
    /**
     *
     */
    export interface Text extends CoordsElement {
    }
    /**
     *
     */
    export interface Button extends Text {
    }
    /**
     *
     */
    export interface Circle extends GeometryElement {
    }
    /**
     *
     */
    export interface Curve extends GeometryElement {
    }
    /**
     * A grid is a set of vertical and horizontal lines to support the user with element placement.
     */
    export interface Grid extends Curve {
    }
    /**
     * This element is used to provide a constructor for a generic conic section uniquely defined by five points.
     */
    export interface Conic extends Curve {
    }
    /**
     * 
     */
    export interface Ellipse extends Conic {
    }
    /**
     *
     */
    export interface Sector extends Curve {
    }
    /**
     *
     */
    export interface Angle extends Sector {
        /**
         * Set an angle to a prescribed value given in radians. This is only possible if the third point of the angle, i.e. the anglepoint is a free point.
         * @param val Number or Function which returns the size of the angle in Radians.
         */
        setAngle(val: any): Angle
    }
    /**
     *
     */
    export interface Functiongraph {
    }
    /**
     *
     */
    export interface Point extends CoordsElement {
    }
    /**
     *
     */
    export interface Glider extends Point {
    }
    /**
     *
     */
    export interface Slider extends Glider {
        /**
         * Returns the current slider value.
         */
        Value(): number;
    }
    /**
     *
     */
    export interface Line extends GeometryElement {
    }
    /**
     *
     */
    export interface Arrow extends Line {
    }
    /**
     *
     */
    export interface Axis extends Line {
    }
    /**
     *
     */
    export interface Segment extends Line {
    }
    /**
     *
     */
    export interface Tapemeasure extends Segment {
    }
    /**
     *
     */
    export interface Turtle extends GeometryElement {
        /**
         *
         */
        pos: number[];
        /**
         * Move the turtle forward.
         @param len of forward move in user coordinates
         */
        forward(len: number): Turtle;
        /**
         * Moves the turtle to position [0,0].
         */
        home(): Turtle;
        /**
         * Rotate the turtle direction to the left.
         * @param {number} angle of the rotation in degrees
         */
        left(angle: number): Turtle;
        /**
         * Rotate the turtle direction to the right.
         * @param {number} angle of the rotation in degrees
         */
        right(angle: number): Turtle;
        /**
         * Sets the pen color. Equivalent to setAttribute({strokeColor:color}) but affects only the future turtle.
         */
        setPenColor(color: string): Turtle;
        /**
         * Sets the pen size. Equivalent to setAttribute({strokeWidth:size}) but affects only the future turtle.
         */
        setPenSize(size: number): Turtle;
    }
    /**
     *
     */
    export interface Board {
        /**
         *
         */
        create(elementType: "angle", parents?: any[], attributes?: {}): Angle;
        /**
         *
         */
        create(elementType: "arrow", parents?: any[], attributes?: {}): Arrow;
        /**
         *
         */
        create(elementType: "axis", parents?: any[], attributes?: {}): Axis;
        /**
         *
         */
        create(elementType: "button", parents?: any[], attributes?: {}): Button;
        /**
         *
         */
        create(elementType: "circle", parents: any[], attributes?: {}): Circle;
        /**
         *
         */
        create(elementType: "conic", parents: any[], attributes?: {}): Conic;
        /**
         *
         */
        create(elementType: "curve", parents: any[], attributes?: {}): Curve;
        /**
         *
         */
        create(elementType: "ellipse", parents: any[], attributes?: {}): Ellipse;
        /**
         *
         */
        create(elementType: "functiongraph", parents?: any[], attributes?: {}): Functiongraph;
        /**
         *
         */
        create(elementType: "glider", parents: any[], attributes?: {}): Glider;
        /**
         *
         */
        create(elementType: "grid", parents: any[], attributes?: {}): Grid;
        /**
         *
         */
        create(elementType: "line", parents: any[], attributes?: {}): Line;
        /**
         *
         */
        create(elementType: "point", parents?: any[], attributes?: {}): Point;
        /**
         *
         */
        create(elementType: "slider", parents: any[], attributes?: {}): Slider;
        /**
         *
         */
        create(elementType: "tapemeasure", parents?: any[], attributes?: {}): Tapemeasure;
        /**
         *
         */
        create(elementType: "text", parents?: any[], attributes?: {}): Text;
        /**
         *
         */
        create(elementType: "turtle", parents?: any[], attributes?: {}): Turtle;
        /**
         * Stop updates of the board.
         * @return Reference to the board
         */
        suspendUpdate(): Board;
        /**
         * Enables updates of the board.
         * @return Reference to the board
         */
        unsuspendUpdate(): Board;
        /**
         * Runs through most elements and calls their update() method and update the conditions.
         * @param drag Element that caused the update.
         * @return Reference to the board
         */
        update(drag?: GeometryElement): Board;
    }
    /**
     *
     */
    export interface Graph {
        /**
         * Initialize a new board.
         * @param box Html-ID to the Html-element in which the board is painted.
         * @param attributes An object that sets some of the board properties. Most of these properties can be set via JXG.Options.
         * @returns Reference to the created board.
         */
        initBoard(box: string, attributes: { axis?: boolean; boundingbox?: number[]; showCopyright?: boolean; showNavigation?: boolean}): Board;
    }
    /**
     *
     */
    var JSXGraph: Graph;
    /**
     *
     */
    export interface Math {
        /**
         * eps defines the closeness to zero.
         * If the absolute value of a given number is smaller than eps, it is considered to be equal to zero.
         */
        eps: number;
        /**
         * Computes the binomial coefficient n over k.
         * @param n
         * @param k
         */
        binomial(n: number, k: number): number;
        /**
         * Computes the hyperbolic cosine of x.
         * @param x
         */
        cosh(x: number): number;
    }
    /**
     *
     */
    var Math: Math;
}
