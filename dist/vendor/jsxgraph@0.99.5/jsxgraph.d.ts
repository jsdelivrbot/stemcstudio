//
// Copyright 2015-2016 David Holmes, https://github.com/geometryzen
// JSXGraph 0.99.5
//
/**
 * JXG namespace.
 */
declare module JXG {
    /**
     * 
     */
    export function addEvent(target: any, eventName: string, handler: () => any, something: any): void;
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

    type HTMLColorString = string;

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
         * 
         */
        opacity?: number;

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
        strokeColor?: string | (() => string);

        /**
         * Opacity for element's stroke color.
         */
        strokeOpacity?: number;

        /**
         * Width of the element's stroke.
         */
        strokeWidth?: number | (() => number);

        /**
         * 
         */
        style?: number;

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
    export interface TextAttributes extends GeometryElementAttributes {
        /**
         * Anchor element of the text.
         * If it exists, the coordinates of the text are relative to this anchor element. 
         */
        anchor?: Point | Text | Image;
        /**
         * The horizontal alignment of the text.
         * The default value is 'left'.
         */
        anchorX?: 'left' | 'middle' | 'right';
        /**
         * The vertical alignment of the text.
         * The default value is 'middle'.
         */
        anchorY?: 'top' | 'middle' | 'bottom';
        /**
         * List of attractor elements.
         * If the distance of the text is less than attractorDistance the text is made to glider of this element. 
         */
        attractors?: GeometryElement[];
        /**
         * The precision of the slider value displayed in the optional text. 
         */
        cssClass?: string;
        /**
         * Used to round texts given by a number.
         * The default value is 2.
         */
        digits?: number;
        /**
         * Sensitive area for dragging the text.
         * Possible values are 'all', or something else.
         * This may be extended to left, right, ... in the future.
         */
        dragArea?: 'all' | string;
        /**
         * The font size in pixels.
         * The default value is 12.
         */
        fontSize?: number;
        /**
         * 
         */
        highlightCssClass?: string;
        /**
         * 
         */
        isLabel?: boolean;
        /**
         * 
         */
        parse?: boolean;
        /**
         * 
         */
        rotate?: number;
        /**
         * 
         */
        snapSizeX?: number;
        /**
         * 
         */
        snapSizeY?: number;
        /**
         * 
         */
        useASCIIMathML?: boolean;
        /**
         * 
         */
        useCaja?: boolean;
        /**
         * 
         */
        useMathJax?: boolean;
    }

    /**
     *
     */
    export interface Button extends Text {
    }

    /**
     *
     */
    export interface Chart extends GeometryElement {
    }

    /**
     * 
     */
    export interface ChartAttributes extends GeometryElementAttributes {
        center?: PointSpecification;
        chartStyle: 'bar' | 'pie';
        colors?: string[];
        gradient?: 'linear';
        highlightColors?: string[];
        highlightOnSector?: boolean;
        highlightBySize?: boolean;
        labels?: string[];
    }

    /**
     *
     */
    export interface Checkbox extends Text {
        /**
         * 
         */
        Value(): boolean;
    }

    /**
     *
     */
    export interface CheckboxAttributes extends TextAttributes {
        /**
         * Control the attribute "disabled" of the HTML checkbox.
         * Default value is false.
         */
        disabled?: boolean;
    }

    /**
     *
     */
    export interface Circle extends GeometryElement {
        center: Point;
        Radius(): number;
    }

    /**
     * 
     */
    export interface CircleAttributes extends GeometryElementAttributes {
    }

    /**
     *
     */
    export interface Curve extends GeometryElement {
        updateDataArray: () => any;
    }

    /**
     * 
     */
    export interface CurveAttributes extends GeometryElementAttributes {
    }

    /**
     * A grid is a set of vertical and horizontal lines to support the user with element placement.
     */
    export interface Grid extends Curve {
    }

    /**
     * 
     */
    export interface Group extends GeometryElement {
    }

    /**
     * 
     */
    export interface GroupAttributes extends GeometryElementAttributes {
    }

    /**
     * 
     */
    export interface Image extends GeometryElement {

    }

    export interface ImageAttributes {

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
    export interface Hyperbola extends Conic {
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
         * Indicates a right angle.
         * Invisible by default, use dot.visible: true to show.
         * Though this dot indicates a right angle, it can be visible even if the angle is not a right one.
         */
        dot: Point;
        /**
         * The point defining the radius of the angle element.
         */
        point: Point;
        /**
         * Helper point for angles of type 'square'.
         */
        pointsquare: Point;
        /**
         * Frees an angle from a prescribed value.
         */
        free(): void;
        /**
         * Set an angle to a prescribed value given in radians.
         * This is only possible if the third point of the angle, i.e. the anglepoint is a free point.
         * param val Number or Function which returns the size of the angle in Radians.
         */
        setAngle(val: number | NumberFunction): Angle;
        /**
         * Returns the value of the angle in Radians.
         */
        Value(): number;
    }

    /**
     * 
     */
    export interface AngleAttributes {
        /**
         * Sensitivity (in degrees) to declare an angle as right angle.
         */
        orthoSensitivity?: number;
        /**
         * Display type of the angle field in case of a right angle.
         */
        orthoType?: 'square' | 'sectordot';
        /**
         * Radius of the sector, displaying the angle.
         */
        radius?: number;
        /**
         * Display type of the angle field.
         */
        type?: 'sector';
    }

    /**
     *
     */
    export interface Functiongraph extends GeometryElement {
    }

    export interface FunctiongraphAttributes extends GeometryElementAttributes {
    }

    /**
     *
     */
    export interface Point extends CoordsElement {
        X(): number;
        Y(): number;
        Dist(point: Point): number;
    }

    type FaceType = 'x' | 'cross' | 'o' | 'circle' | '[]' | 'square' | '+' | 'plus' | '<>' | 'diamond' | '^' | 'triangleUp' | 'triangleDown' | '<' | 'triangleLeft' | '>' | 'triangleRight';

    /**
     * 
     */
    export interface PointAttributes extends CoordsElementAttributes {
        attractorDistance?: number;
        attractors?: any[];
        attractorUnit?: 'screen' | 'user';
        face?: FaceType;
        ignoredSnapToPoints?: any[];
        infoboxDigits?: any;
        name?: string;
        showInfobox?: boolean;
        size?: number;
        snapSizeX?: number;
        snapSizeY?: number;
        snapToGrid?: boolean;
        snapToPoints?: boolean;
        snatchDistance?: number;
        zoom?: boolean;
    }

    /**
     * 
     */
    export interface Polygon extends GeometryElement {

    }

    /**
     * 
     */
    export interface PolygonAttributes extends GeometryElementAttributes {
        /**
         * 
         */
        withLines?: boolean;
    }

    /**
     *
     */
    export interface Glider extends Point {
    }

    /**
     * 
     */
    export interface GliderAttributes extends GeometryElementAttributes {
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
    export interface SliderAttributes extends GeometryElementAttributes {
        /**
         * 
         */
        snapWidth?: number;
    }

    /**
     *
     */
    export interface Line extends GeometryElement {
        /**
         * Determines the angle between the positive x axis and the line.
         */
        getAngle(): number;

        /**
         * The distance between the two points defining the line.
         */
        L(): number;

        /**
         * Startpoint of the line.
         */
        point1: Point;

        /**
         * Endpoint of the line.
         */
        point2: Point;
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
         * Determines whether the line is drawn beyond the first defining point.
         */
        straightFirst?: boolean;
        /**
         * Determines whether the line is drawn beyond the second defining point.
         */
        straightLast?: boolean;
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
    export interface ArrowAttributes extends GeometryElementAttributes {
    }

    /**
     *
     */
    export interface Axis extends Line {
        /**
         * 
         */
        defaultTicks: Ticks;
    }

    /**
     *
     */
    export interface AxisAttributes extends GeometryElementAttributes {
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
    export interface Ticks {

    }

    /**
     *
     */
    export interface Tapemeasure extends Segment {
    }

    export interface Transform extends GeometryElement {
        bindTo(element: GeometryElement): void;
    }

    export interface TransformAttributes {
        type: 'rotate' | 'scale' | 'translate';
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
    type ElementType = 'angle' | 'arc' | 'arrow' | 'axis' | 'button' | 'chart' | 'checkbox' | 'circle' | 'conic' | 'curve' | 'ellipse' | 'functiongraph' | 'glider' | 'grid' | 'group' | 'hyperbola' | 'image' | 'line' | 'point' | 'polygon' | 'segment' | 'slider' | 'tapemeasure' | 'text' | 'transform' | 'turtle';

    /**
     * GEONExT syntax for coordinates.
     */
    type GEONExT = string;

    /**
     * 
     */
    type ImageURL = string;

    /**
     * 
     */
    type NumberFunction = () => number;

    /**
     * 
     */
    type CurveFunction = (x: number) => number;

    /**
     * 
     */
    type CoordSpecification = number | NumberFunction | GEONExT;

    /**
     * 
     */
    type PointSpecification = CoordSpecification[] | Point | GEONExT;

    /**
     * 
     */
    type StringFunction = () => string;

    /**
     *
     */
    export interface Board {
        /**
         * 
         */
        containerObj: HTMLDivElement;
        /**
         * 
         */
        options: {
            label: {
                strokeColor: string;
            };
        };
        /**
         * 
         */
        renderer: {
            dumpToCanvas(elementId: string): void;
        }
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
        create(elementType: ElementType, parents: any[], attributes: GeometryElementAttributes): GeometryElement;
        /**
         *
         */
        create(elementType: "angle", parents?: Point[], attributes?: AngleAttributes): Angle;
        /**
         *
         */
        create(elementType: "arc", parents?: any[], attributes?: {}): Arc;
        /**
         *
         */
        create(elementType: "arrow", parents?: [PointSpecification, PointSpecification], attributes?: ArrowAttributes): Arrow;
        /**
         *
         */
        create(elementType: "axis", parents?: (number[] | Point)[] | [number, number, number], attributes?: AxisAttributes): Axis;
        /**
         *
         */
        create(elementType: "button", parents?: any[], attributes?: {}): Button;
        /**
         *
         */
        create(elementType: "chart", parents: number[], attributes?: ChartAttributes): Chart;
        /**
         *
         */
        create(elementType: "checkbox", parents?: [number, number, string], attributes?: CheckboxAttributes): Checkbox;
        /**
         *
         */
        create(elementType: "circle", parents: ((number[] | number | NumberFunction | GEONExT)[] | GEONExT | number | Point)[], attributes?: CircleAttributes): Circle;
        /**
         *
         */
        create(elementType: "conic", parents: any[], attributes?: {}): Conic;
        /**
         *
         */
        create(elementType: "curve", parents: (number[] | CurveFunction)[], attributes?: CurveAttributes): Curve;
        /**
         *
         */
        create(elementType: "ellipse", parents: [PointSpecification, PointSpecification, (PointSpecification | number | NumberFunction)], attributes?: {}): Ellipse;
        /**
         *
         */
        create(elementType: "functiongraph", parents?: (CurveFunction | number)[], attributes?: FunctiongraphAttributes): Functiongraph;
        /**
         *
         */
        create(elementType: "glider", parents: (number | GeometryElement)[], attributes?: GliderAttributes): Glider;
        /**
         *
         */
        create(elementType: "grid", parents: any[], attributes?: {}): Grid;
        /**
         *
         */
        create(elementType: "group", parents: GeometryElement[], attributes?: GroupAttributes): Group;
        /**
         *
         */
        create(elementType: "hyperbola", parents: [PointSpecification, PointSpecification, (PointSpecification | number | NumberFunction)], attributes?: {}): Hyperbola;
        /**
         *
         */
        create(elementType: "image", parents: [ImageURL, PointSpecification, PointSpecification], attributes?: ImageAttributes): Image;
        /**
         *
         */
        create(elementType: "line", parents: [PointSpecification, PointSpecification], attributes?: LineAttributes): Line;
        /**
         *
         */
        create(elementType: "point", parents: (number | NumberFunction | Point | string | Transform)[], attributes?: PointAttributes): Point;
        /**
         *
         */
        create(elementType: "polygon", parents: Point[], attributes?: PolygonAttributes): Polygon;
        /**
         *
         */
        create(elementType: "segment", parents: Point[], attributes?: SegmentAttributes): Segment;
        /**
         *
         */
        create(elementType: "slider", parents: [PointSpecification, PointSpecification, number[]], attributes?: SliderAttributes): Slider;
        /**
         *
         */
        create(elementType: "tapemeasure", parents?: any[], attributes?: {}): Tapemeasure;
        /**
         *
         */
        create(elementType: "text", parents?: [number | NumberFunction, number | NumberFunction, string | StringFunction], attributes?: TextAttributes): Text;
        /**
         *
         */
        create(elementType: "transform", parents: ((() => number) | Point)[], attributes?: TransformAttributes): Transform;
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
                /**
                 * Show default axis.
                 * If shown, the horizontal axis can be accessed via JXG.Board.defaultAxes.x, the
                 * vertical axis can be accessed via JXG.Board.defaultAxes.y. Both axes have a sub-element "defaultTicks".
                 * default false
                 */
                axis?: boolean;

                /**
                 * Bounding box of the visible area in user coordinates.
                 * It is an array consisting of four values:
                 * [x<sub>1</sub>, y<sub>1</sub>, x<sub>2</sub>, y<sub>2</sub>]
                 *
                 * The canvas will be spanned from the upper left corner (<sub>1</sub>, y<sub>1</sub>)
                 * to the lower right corner (x<sub>2</sub>, y<sub>2</sub>).
                 *
                 * default [-5, 5, 5, -5]
                 */
                boundingbox?: number[];

                /**
                 * Supply the document object. Defaults to window.document
                 *
                 * default false (meaning window.document)
                 */
                document?: boolean | Document;

                /**
                 * 
                 */
                grid?: boolean;

                /**
                 * If set true and
                 * hasPoint() is true for both an element and it's label,
                 * the element (and not the label) is taken as drag element.
                 *
                 * If set false and hasPoint() is true for both an element and it's label,
                 * the label is taken (if it is on a higher layer than the element)
                 *
                 * default true
                 */
                ignoreLabels?: boolean;

                /**
                 * If set to true the bounding box might be changed such that
                 * the ratio of width and height of the hosting HTML div is equal
                 * to the ratio of wifth and height of the bounding box.
                 *
                 * This is necessary if circles should look like circles and not
                 * like ellipses. It is recommended to set keepAspectRatio = true
                 * for geometric applets. For function plotting keepAspectRatio = false
                 * might be the better choice.
                 *
                 * default false
                 */
                keepAspectRatio?: boolean;

                /**
                 * Maximum number of digits in automatic label generation.
                 * For example, if set to 1 automatic point labels end at "Z".
                 * If set to 2, point labels end at "ZZ".
                 *
                 * default 1
                 */
                maxNameLength?: number;

                /**
                 * 
                 */
                pan?: boolean;

                /**
                 * Show a button which allows to clear all traces of a board.
                 *
                 * default false
                 */
                showClearTraces?: boolean;

                /**
                 * Show copyright string in canvas.
                 *
                 * default true
                 */
                showCopyright?: boolean;

                /**
                 * Display of navigation arrows and zoom buttons
                 *
                 * default true
                 */
                showNavigation?: boolean;

                /**
                 * Show a button to force reload of a construction.
                 * Works only with the JessieCode tag
                 *
                 * default false
                 */
                showReload?: boolean;

                /**
                 * Display of zoom buttons. To show zoom buttons, additionally
                 * showNavigation has to be set to true.
                 *
                 * default true
                 */
                showZoom?: boolean;

                /**
                 * 
                 */
                zoom?: boolean;

                /**
                 * Additional zoom factor multiplied to zoomX and zoomY.
                 * default 1.0
                 */
                zoomFactor?: number;

                /**
                 * Zoom factor in horizontal direction.
                 * default 1.0
                 */
                zoomX?: number;

                /**
                 * Zoom factor in vertical direction.
                 * default 1.0
                 */
                zoomY?: number;
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
    export interface JXGOptions {
        text: {
            fontSize: number;
        }
    }
    /**
     *
     */
    var JSXGraph: Graph;
    var Options: JXGOptions;
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
        Geometry: Geometry;
        /**
         * The JXG.Math.Numerics namespace holds numerical algorithms, constants, and variables.
         */
        Numerics: Numerics;
    }
    /**
     * Math Namespace
     */
    var Math: Math;

    export interface Geometry {
        /**
         * Calculates the angle defined by the points A, B, C.
         */
        angle(A: Point | number[], B: Point | number[], C: Point | number[]): number;
    }

    export interface Numerics {
        /**
         * Numerical (symmetric) approximation of derivative.
         */
        D(f: (x: number) => number, obj?: any): (x: number) => number;

        /**
         * Solves a system of linear equations given by A and b using the Gauss-Jordan-elimination.
         * The algorithm runs in-place. I.e. the entries of A and b are changed.
         * param A Square matrix represented by an array of rows, containing the coefficients of the linear equation system.
         * param b A vector containing the linear equation system's right hand side.
         * returns A vector that solves the linear equation system.
         */
        Gauss(A: number[][], b: number[]): number[];

        /**
         * Computes the polynomial through a given set of coordinates in Lagrange form.
         * Returns the Lagrange polynomials, see Jean-Paul Berrut, Lloyd N. Trefethen: Barycentric Lagrange Interpolation,
         * SIAM Review, Vol 46, No 3, (2004) 501-517.
         * @returns A function of one parameter which returns the value of the polynomial, whose graph runs through the given points.
         */
        lagrangePolynomial(p: Point[]): (t: number) => number;

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
