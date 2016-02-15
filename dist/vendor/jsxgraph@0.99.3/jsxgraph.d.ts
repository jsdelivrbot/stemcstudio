//
// Copyright 2015-2016 David Holmes, https://github.com/geometryzen
//
/**
 * JXG namespace.
 */
declare module JXG {
    /**
     * Converts HSV color to RGB color. Based on C Code in "Computer Graphics -- Principles and Practice," Foley et al, 1996, p. 593. See also http://www.efg2.com/Lab/Graphics/Colors/HSV.htm 
     * param H value between 0 and 360
     * param S value between 0.0 (shade of gray) to 1.0 (pure color)
     * param V value between 0.0 (black) to 1.0 (white)
     * return RGB color string
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
         * Hides the element. It will still exist but not be visible on the board.
         */
        hideElement(): void;

        /**
         * Register a new event handler.
         * For a list of possible events see documentation of the elements and objects implementing the EventEmitter interface. 
         * param event
         * param handler
         * param context The context the handler will be called in, default is the element itself.
         */
        on(event: string, handler: (e: Event) => void, context?: {}): void;

        /**
         * Sets an arbitrary number of attributes.
         * param attributes An object with attributes.
         */
        setAttribute(attributes: {}): void;

        /**
         * Updates the element's label text, strips all html.
         * param text The element label text.
         */
        setLabelText(text: string): string;

        /**
         * Updates the element's label text and the element's attribute "name", strips all html.
         * param name The element name.
         */
        setName(name: string): string;

        /**
         * Makes the element visible.
         */
        showElement(): void;
    }

    /**
     *
     */
    export interface GeometryElementAttributes {

        /**
         * Determines the elements border-style.
         * Possible values are:
         * <ul><li>0 for a solid line</li>
         * <li>1 for a dotted line</li>
         * <li>2 for a line with small dashes</li>
         * <li>3 for a line with medium dashes</li>
         * <li>4 for a line with big dashes</li>
         * <li>5 for a line with alternating medium and big dashes and large gaps</li>
         * <li>6 for a line with alternating medium and big dashes and small gaps</li></ul>
         */
        dash?: number;

        /**
         * The fill color of this geometry element.
         */
        fillColor?: string;

        /**
         * Opacity for fill color.
         */
        fillOpacity?: number;

        /**
         * If true, the element is fixed and can not be dragged around.
         */
        fixed?: boolean;

        /**
         * If true the element is fixed and can not be dragged around. The element
         * will even stay at its position on zoom and moveOrigin events.
         * Only free elements like points, texts, curves can be frozen.
         */
        frozen?: boolean;

        /**
         *
         */
        highlight?: boolean;

        /**
         * The fill color of the given geometry element when the mouse is pointed over it.
         */
        highlightFillColor?: string;

        /**
         * Opacity for fill color when the object is highlighted.
         */
        highlightFillOpacity?: number;

        /**
         * The stroke color of the given geometry element when the user moves the mouse over it.
         */
        highlightStrokeColor?: string;

        /**
         * Width of the element's stroke when the mouse is pointed over it.
         */
        highlightStrokeWidth?: number;

        /**
         * Opacity for stroke color when the object is highlighted.
         */
        highlightStrokeOpacity?: number;

        /**
         * Display layer which will contain the element.
         */
        layer?: number;

        /**
         * Not necessarily unique name for the element.
         */
        name?: string;

        /**
         * If this is set to true, the element is updated in every update
         * call of the board. If set to false, the element is updated only after
         * zoom events or more generally, when the bounding box has been changed.
         */
        needsRegularUpdate?: boolean;

        /**
         * A private element will be inaccessible in certain environments, e.g. a graphical user interface.
         */
        priv?: boolean;

        /**
         * Determines whether two-finger manipulation of this object may change its size.
         * If set to false, the object is only rotated and translated.
         */
        scalable?: boolean;

        /**
         * If true the element will get a shadow.
         */
        shadow?: boolean;

        /**
         * Snaps the element or its parents to the grid. Currently only relevant for points, circles,
         * and lines. Points are snapped to grid directly, on circles and lines it's only the parent
         * points that are snapped
         */
        snapToGrid?: boolean;

        /**
         * The stroke color of the given geometry element.
         */
        strokeColor?: string;

        /**
         * Opacity for element's stroke color.
         */
        strokeOpacity?: number;

        /**
         * Width of the element's stroke.
         */
        strokeWidth?: number;

        /**
         * If true the element will be traced, i.e. on every movement the element will be copied
         * to the background. Use {@link JXG.GeometryElement#clearTrace} to delete the trace elements.
         */
        trace?: boolean;

        /**
         * Extra visual properties for traces of an element
         */
        traceAttributes?: {};

        /**
         * If false the element won't be visible on the board, otherwise it is shown.
         */
        visible?: boolean;

        /**
         * If true, a label will display the element's name.
         */
        withLabel?: boolean;
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
         * param where Array containing the x and y coordinate of the target location.
         * param time Number of milliseconds the animation should last.
         * param options
         */
        moveTo(where: number[], time?: number, options?: { callback?: () => void; effect?: string; }): Point;
    }

    /**
     *
     */
    export interface CoordsElementAttributes extends GeometryElementAttributes {

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
        Radius(): number;
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
         * param val Number or Function which returns the size of the angle in Radians.
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
        X(): number;
        Y(): number;
    }

    export interface PointAttributes extends CoordsElementAttributes {
        face?: string;
        name?: string;
        size?: number;
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
        /**
         * Determines the angle between the positive x axis and the line.
         */
        getAngle(): number

        /**
         * The distance between the two points defining the line.
         */
        L(): number;
    }

    export interface LineAttributes extends GeometryElementAttributes {
        /**
         * Determines whether the line has an arrow at the first defining point.
         */
        firstArrow?: boolean;

        /**
         * Determines whether the line has an arrow at the second defining point.
         */
        lastArrow?: boolean;

        /**
         * Colors the line in the color specified.
         */
        strokeColor?: string;

        /**
         * Determines whether the line is traced.
         */
        trace?: boolean;
    }

    /**
     *
     */
    export interface Arc extends Line {
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

    export interface SegmentAttributes extends LineAttributes {
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
         param len of forward move in user coordinates
         */
        forward(len: number): Turtle;
        /**
         * Moves the turtle to position [0,0].
         */
        home(): Turtle;
        /**
         * Rotate the turtle direction to the left.
         * param {number} angle of the rotation in degrees
         */
        left(angle: number): Turtle;
        /**
         * Rotate the turtle direction to the right.
         * param {number} angle of the rotation in degrees
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
         * Register a new event handler.
         * For a list of possible events see documentation of the elements and objects
         * implementing the EventEmitter interface. 
         * @method on
         * param event {string}
         * param handler {()=>void}
         * param context [{}] The context the handler will be called in, default is the element itself.
         * return Reference to the object.
         */
        on(event: string, handler: () => void, context?: {}): {};
        /**
         *
         */
        create(elementType: "angle", parents?: any[], attributes?: {}): Angle;
        /**
         *
         */
        create(elementType: "arc", parents?: any[], attributes?: {}): Arc;
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
        create(elementType: "line", parents: any[], attributes?: LineAttributes): Line;
        /**
         *
         */
        create(elementType: "point", parents?: any[], attributes?: PointAttributes): Point;
        /**
         *
         */
        create(elementType: "segment", parents: any[], attributes?: SegmentAttributes): Segment;
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
         * return Reference to the board
         */
        suspendUpdate(): Board;
        /**
         * Enables updates of the board.
         * return Reference to the board
         */
        unsuspendUpdate(): Board;
        /**
         * Runs through most elements and calls their update() method and update the conditions.
         * param drag Element that caused the update.
         * return Reference to the board
         */
        update(drag?: GeometryElement): Board;
    }

    /**
     *
     */
    export interface Graph {

      /**
       * Stores the renderer that is used to draw the boards.
       */
      rendererType: string;

        /**
         * Initialize a new board.
         * param box Html-ID to the Html-element in which the board is painted.
         * param attributes An object that sets some of the board properties. Most of these properties can be set via JXG.Options.
         * returns Reference to the created board.
         */
        initBoard(
            box: string,
            attributes: {
                axis?: boolean;
                boundingbox?: number[];
                grid?: boolean;
                keepaspectratio?: boolean;
                pan?: boolean;
                showCopyright?: boolean;
                showNavigation?: boolean;
                zoom?: boolean;
            }
        ): Board;

        /**
         * Delete a board and all its contents.
         */
        freeBoard(board: Board | string): void
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
         * param n
         * param k
         */
        binomial(n: number, k: number): number;
        /**
         * Computes the hyperbolic cosine of x.
         * param x
         */
        cosh(x: number): number;
        /**
         * Computes the product of the two matrices mat1*mat2.
         * param mat1 Two dimensional array of numbers.
         * param mat2 Two dimensional array of numbers.
         * returns Two dimensional Array of numbers containing result.
         */
        matMatMult(mat1: number[][], mat2: number[][]): number[][];
        /**
         * Multiplies a vector vec to a matrix mat: mat * vec. The matrix is interpreted by this function as an array of rows.
         * Please note: This function does not check if the dimensions match.
         * param mat Two dimensional array of numbers. The inner arrays describe the columns, the outer ones the matrix' rows.
         * param vec Array of numbers.
         * returns Array of numbers containing the result.
         */
        matVecMult(mat: number[][], vec: number[]): number[];
        /**
         * Transposes a matrix given as a two dimensional array.
         * param M The matrix to be transposed.
         * returns The transpose of M.
         */
        transpose(M: number[][]): number[][];
        /**
         * The JXG.Math.Numerics namespace holds numerical algorithms, constants, and variables.
         */
        Numerics: Numerics;
    }
    /**
     * Math Namespace
     */
    var Math: Math;

    export interface Numerics {
        /**
         * Solves a system of linear equations given by A and b using the Gauss-Jordan-elimination.
         * The algorithm runs in-place. I.e. the entries of A and b are changed.
         * param A Square matrix represented by an array of rows, containing the coefficients of the linear equation system.
         * param b A vector containing the linear equation system's right hand side.
         * returns A vector that solves the linear equation system.
         */
        Gauss(A: number[][], b: number[]): number[];
        /**
         * Solve initial value problems numerically using Runge-Kutta-methods.
         * See http://en.wikipedia.org/wiki/Runge-Kutta_methods for more information on the algorithm.
         * param butcher
         * param x0
         * param I
         * param N
         * param f
         * return An array of vectors describing the solution of the ode on the given interval I.
         */
        rungeKutta(butcher, x0: number[], I: number[], N: number, f): number[][];
    }
}
