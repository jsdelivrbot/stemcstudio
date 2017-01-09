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
    export const COORDS_BY_SCREEN: number;
    /**
     * 
     */
    export class Coords {
        constructor(size: number, coords: number[], board: Board);
        /**
         * 
         */
        usrCoords: number[];
    }
    /**
     * A JessieCode object provides an interface to the parser and stores all variables and objects used within a JessieCode script.
     * The optional argument code is interpreted after initializing.
     * To evaluate more code after initializing a JessieCode instance please use parse.
     * For code snippets like single expressions use snippet.
     */
    export class JessieCode {
        /**
         * 
         */
        board: Board;
        /**
         * 
         */
        constructor(code?: string, geonext?: boolean);
        /**
         * 
         */
        dist(p1: Point, p2: Point): number;
        /**
         * 
         */
        getElementId(id: string): GeometryElement;
        /**
         * 
         */
        L(e: Line): number;
        /**
         * 
         */
        parse(code: string, geonext: boolean, dontstore: boolean);
        /**
         * 
         */
        snippet(code: string, funwrap: boolean, varname: string, geonext: boolean): any;
        /**
         * 
         */
        V(e: Glider | Slider): number;
        /**
         * 
         */
        X(e: Point | Text): number;
        /**
         * 
         */
        Y(e: Point | Text): number;
    }
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
        /**
         * Animate the point.
         * direction: The direction the glider is animated. Can be +1 or -1.
         * stepCount: The number of steps.
         */
        startAnimation(direction: number, stepCount: number): void;
        /**
         * Stop animation.
         */
        stopAnimation(): void;
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
    export interface ButtonAttributes extends TextAttributes {
        /**
         * Control the attribute "disabled" of the HTML button.
         * Default Value: false.
         */
        disabled?: boolean;
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
        rendNodeCheckbox;
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
        /**
         * 
         */
        center: Point;
        /**
         * 
         */
        midpoint: Point;
        /**
         * 
         */
        Radius(): number;
    }

    /**
     * 
     */
    export interface CircleAttributes extends GeometryElementAttributes {
        /**
         * 
         */
        center?: Point;
        /**
         * 
         */
        hasInnerPoints?: boolean;
        /**
         * 
         */
        label?: Label;
        /**
         * 
         */
        point?: Point;
    }

    /**
     * Curves are the common object for function graphs, parametric curves, polar curves, and data plots.
     */
    export interface Curve extends GeometryElement {
        /**
         * Array holding the x-coordinates of a data plot.
         * This array can be updated during run time by overwriting the method updateDataArray.
         */
        dataX: number[];
        /**
         * Array holding the y-coordinates of a data plot.
         * This array can be updated during run time by overwriting the method updateDataArray.
         */
        dataY: number[];
        /**
         * Number of points on curves.
         * This value changes between numberPointsLow and numberPointsHigh.
         * It is set in updateCurve.
         */
        numberPoints: number;
        /**
         * Stores a quad tree if it is required.
         * The quad tree is generated in the curve updates and can be used to speed up the hasPoint method.
         */
        qdt: any;
        /**
         * Add transformations to this curve.
         */
        addTransform(transform): Curve;
        /**
         * Allocate points in the Coords array this.points
         */
        allocatePoints(): void;
        /**
         * 
         */
        checkReal();
        /**
         * 
         */
        generateTerm(varname, xterm, yterm, mi, ma);
        /**
         * Checks whether (x,y) is near the curve.
         * x: Coordinate in x direction, screen coordinates.
         * y: Coordinate in y direction, screen coordinates.
         * start: Optional start index for search on data plots.
         */
        hasPoint(x: number, y: number, start: number): boolean;
        /**
         * Gives the default value of the right bound for the curve.
         * May be overwritten in generateTerm.
         */
        maxX(): number;
        /**
         * Gives the default value of the left bound for the curve.
         * May be overwritten in generateTerm.
         */
        minX(): number;
        /**
         * Finds dependencies in a given term and notifies the parents by adding the dependent object to the found objects child elements.
         */
        notifyParents(contentStr: string): void;
        /**
         * Computes for equidistant points on the x-axis the values of the function.
         */
        update(): Curve;
        /**
         * Computes for equidistant points on the x-axis the values of the function.
         * If the mousemove event triggers this update, we use only few points.
         * Otherwise, e.g. on mouseup, many points are used.
         */
        updateCurve(): Curve;
        /**
         * For dynamic dataplots updateCurve can be used to compute new entries for the arrays dataX and dataY.
         * It is used in updateCurve.
         * Default is an empty method, can be overwritten by the user.
         */
        updateDataArray: () => any;
        /**
         * Updates the data points of a parametric curve.
         * This version is used if doadvancedplot is true.
         */
        updateParametricCurve(mi: number, ma: number): Curve;
        /**
         * Updates the data points of a parametric curve.
         * This version is used if doadvancedplot is false.
         */
        updateParametricCurveNaive(mi: number, ma: number, len: number): Curve;
        /**
         * Updates the visual contents of the curve.
         */
        updateRenderer(): Curve;
        /**
         * Applies the transformations of the curve to the given point p.
         * Before using it, updateTransformMatrix has to be called.
         */
        updateTransform(p: Point): Point;
        /**
         * The parametric function which defines the x-coordinate of the curve.
         */
        X(t: number, suspendUpdate: boolean): number;
        /**
         * The parametric function which defines the y-coordinate of the curve.
         */
        Y(t: number, suspendUpdate: boolean): number;
        /**
         * Treat the curve as curve with homogeneous coordinates.
         */
        Z(t: number): number;
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
     * 
     */
    export interface Label {
        fontSize?: number;
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
    export interface Functiongraph extends Curve {
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
     * A glider is a point which lives on another geometric element like a line, circle, curve, turtle.
     */
    export interface Glider extends Point {
        /**
         * When used as a glider this member stores the object, where to glide on.
         * To set the object to glide on use the method makeGlider.
         * DO NOT set this property directly as it will break the dependency tree.
         */
        slideObject: GeometryElement;
    }

    /**
     * 
     */
    export interface GliderAttributes extends GeometryElementAttributes {
    }

    /**
     * Hatch marks can be used to mark congruent lines.
     */
    export interface Hatch extends Ticks {

    }

    /**
     * 
     */
    export interface HatchAttributes extends GeometryElementAttributes {

    }

    /**
     * 
     */
    export interface Input extends Text {
        /**
         * 
         */
        Value(): string;
    }

    /**
     * 
     */
    export interface InputAttributes extends TextAttributes {

    }

    /**
     * 
     */
    export interface Integral extends Curve {

    }

    /**
     * 
     */
    export interface IntegralAttributes extends CurveAttributes {

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
    export interface Slopetriangle extends Line {

    }

    /**
     * 
     */
    export interface SlopetriangleAttributes extends LineAttributes {
        /**
         * 
         */
        baseline;
        /**
         * 
         */
        basepoint;
        /**
         * 
         */
        glider;
        /**
         * 
         */
        label;
        /**
         * 
         */
        tangent;
        /**
         * 
         */
        toppoint;
    }

    /**
     *
     */
    export interface Stepfunction extends Curve {
    }

    export interface StepfunctionAttributes extends CurveAttributes {
    }

    /**
     * With the element tangent the slope of a line, circle, or curve in a certain point can be visualized.
     * A tangent is always constructed by a glider on a line, circle, or curve and describes the tangent in the glider point on that line, circle, or curve. 
     */
    export interface Tangent extends Line {

    }

    /**
     * 
     */
    export interface TangentAttributes extends LineAttributes {

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
    export interface Arc extends Curve {
        /**
         * The point defining the arc's angle.
         */
        anglepoint: Point;
        /**
         * Center of the arc.
         */
        center: Point;
        /**
         * Point defining the arc's radius.
         */
        radiuspoint: Point;
        /**
         * Checks whether (x,y) is within the sector defined by the arc.
         * x: Coordinate in x direction, screen coordinates.
         * y: Coordinate in y direction, screen coordinates.
         */
        hasPointSector(x: number, y: number): boolean;
        /**
         * Determines the arc's current radius.
         * i.e. the distance between center and radiuspoint.
         */
        Radius(): number;
        /**
         * Returns the length of the arc.
         */
        Value(): number;
    }

    /**
     * 
     */
    export interface ArcAttributes extends CurveAttributes {

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
     * A reflected point is given by a point and a line.
     * It is determined by the reflection of the given point against the given line.
     */
    export interface Reflection extends Point {

    }

    /**
     * 
     */
    export interface ReflectionAttributes extends PointAttributes {

    }

    /**
     * 
     */
    export interface Riemannsum extends Curve {
        /**
         * 
         */
        Value(): number;
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
    export interface Ticks extends GeometryElement {

    }

    /**
     * 
     */
    export interface TicksAttributes extends GeometryElementAttributes {
        /**
         * 
         */
        anchor?: 'left' | 'middle' | 'right';
        /**
         * 
         */
        drawLabels?: boolean;
        /**
         * 
         */
        drawZero?: boolean;
        /**
         * 
         */
        generateLableText?: (labeled: Coords, center: Coords) => string;
        /**
         * 
         */
        generateLableValue?: (labeled: Coords, center: Coords) => string;
        /**
         * 
         */
        includeBoundaries?: boolean;
        /**
         * 
         */
        insertTicks?: boolean;
        /**
         * 
         */
        labels?: string[];
        /**
         * 
         */
        majorHeight?: number;
        /**
         * 
         */
        maxLabelLength?: number;
        /**
         * 
         */
        minorHeight?: number;
        /**
         * 
         */
        minorTicks?: number;
        /**
         * 
         */
        precision?: number;
        /**
         * 
         */
        scale?: number;
        /**
         * 
         */
        tickEndings?: number[];
        /**
         * 
         */
        ticksDistance?: number;
        /**
         * 
         */
        useUnicodeMinus?: boolean;
    }

    /**
     *
     */
    export interface Tapemeasure extends Segment {
    }

    /**
     * 
     */
    export interface TapemeasureAttributes extends LineAttributes {
        label?;
        point1?;
        point2?;
        precision?;
        ticks?;
        withLabel?;
        withTicks?;
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
    export interface Turtle {
        /**
         *
         */
        pos: number[];
        /**
         * Move the turtle backwards.
         */
        back(distance: number): Turtle;
        /**
         * Alias for back.
         */
        bk(distance: number): Turtle;
        /**
         * Removes the turtle curve from the board.
         * The turtle stays in its position.
         */
        clean(): Turtle;
        /**
         * Removes the turtle completely and resets it to its initial position and direction.
         */
        clearScreen(): Turtle;
        /**
         * Alias for clearScreen.
         */
        cs(): Turtle;
        /**
         * Alias for forward.
         */
        fd(distance: number): Turtle;
        /**
         * Move the turtle forward.
         */
        forward(distance: number): Turtle;
        /**
         * Checks whether (x,y) is near the curve.
         * x: Coordinate in x direction, screen coordinates.
         * y: Coordinate in y direction, screen coordinates.
         */
        hasPoint(x: number, y: number): boolean;
        /**
         * Sets the visibility of the turtle head to false.
         */
        hideTurtle(): Turtle;
        /**
         * Moves the turtle to position [0,0].
         */
        home(): Turtle;
        /**
         * Alias for hideTurtle.
         */
        ht(): Turtle;
        /**
         * Rotate the turtle direction to the left.
         * angle: angle of the rotation in degrees.
         */
        left(angle: number): Turtle;
        /**
         * Rotates the turtle into a new direction.
         * There are two possibilities:
         * If a number is given, it is interpreted as the new direction to look to.
         * If an array consisting of two numbers is given, target is used as a pair coordinates.
         */
        lookTo(target: number | [number, number]): Turtle;
        /**
         * Alias for left.
         */
        lt(angle: number): Turtle;
        /**
         * Gives the upper bound of the parameter if the the turtle is treated as parametric curve.
         */
        maxX(): number;
        /**
         * Gives the lower bound of the parameter if the the turtle is treated as parametric curve.
         */
        minX(): number;
        /**
         * Moves the turtle to a given coordinate pair.
         * The direction is not changed.
         */
        moveTo(target: [number, number]): Turtle;
        /**
         * Alias for penDown.
         */
        pd(): Turtle;
        /**
         * Pen down, continues visible drawing.
         */
        penDown(): Turtle;
        /**
         * Pen up, stops visible drawing.
         */
        penUp(): Turtle;
        /**
         * Alias for popTurtle.
         */
        pop(): Turtle;
        /**
         * Gets the last position of the turtle on the stack,
         * sets the turtle to this position and removes this position from the stack.
         */
        popTurtle(): Turtle;
        /**
         * Alias for penUp.
         */
        pu(): Turtle;
        /**
         * Alias for pushTurtle.
         */
        push(): Turtle;
        /**
         * Pushes the position of the turtle on the stack.
         */
        pushTurtle(): Turtle;
        /**
         * Alias for right.
         */
        rt(angle: number): Turtle;
        /**
         * Rotate the turtle direction to the right.
         * angle: angle of the rotation in degrees.
         */
        right(angle: number): Turtle;
        /**
         * Sets properties of the turtle.
         * Sets the property for all curves of the turtle in the past and in the future.
         */
        setAttributes(attributes: {}): Turtle;
        /**
         * Sets the highlight pen color.
         * Equivalent to setAttribute({highlightStrokeColor: color}) but affects only the future turtle.
         */
        setHighlightPenColor(color: string): Turtle;
        /**
         * Sets the pen color.
         * Equivalent to setAttribute({strokeColor: color}) but affects only the future turtle.
         */
        setPenColor(color: string): Turtle;
        /**
         * Sets the pen size.
         * Equivalent to setAttribute({strokeWidth: size}) but affects only the future turtle.
         */
        setPenSize(size: number): Turtle;
        /**
         * Moves the turtle without drawing to a new position.
         */
        setPos(x: number, y: number): Turtle;
        /**
         * Sets the visibility of the turtle head to true.
         */
        showTurtle(): Turtle;
        /**
         * Alias for showTurtle.
         */
        st(): Turtle;
        /**
         * If t is not supplied the x-coordinate of the turtle is returned.
         * Otherwise the x-coordinate of the turtle curve at position t is returned.
         */
        X(t?: number): number;
        /**
         * If t is not supplied the y-coordinate of the turtle is returned.
         * Otherwise the y-coordinate of the turtle curve at position t is returned.
         */
        Y(t?: number): number;
        /**
         * Returns the z-coordinate of the turtle position.
         */
        Z(t: number): number;
    }

    /**
     * Attributes to change the visual properties of the turtle object.
     * All angles are in degrees.
     */
    export interface TurtleAttributes {
        /**
         * 
         */
        arrow?: {

        }
    }

    /**
     * 
     */
    type ElementType = 'angle' | 'arc' | 'arrow' | 'axis' | 'button' | 'chart' | 'checkbox' | 'circle' | 'conic' | 'curve' | 'ellipse' | 'functiongraph' | 'glider' | 'grid' | 'group' | 'hatch' | 'hyperbola' | 'image' | 'input' | 'integral' | 'line' | 'plot' | 'point' | 'polygon' | 'reflection' | 'riemannsum' | 'segment' | 'slider' | 'slopetriangle' | 'stepfunction' | 'tangent' | 'tapemeasure' | 'text' | 'ticks' | 'transform' | 'turtle';

    /**
     * GEONExT syntax for coordinates.
     */
    type GEONExT = string;

    /**
     * 
     */
    type HandlerFunction = () => any;

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
    type BorderSpecification = number | NumberFunction;

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
        BOARD_MODE_NONE: number;
        /**
         *
         */
        canvasHeight: number;
        /**
         * 
         */
        canvasWidth: number;
        /**
         * The HTML id of the HTML element containing the board.
         */
        container: string;
        /**
         * The HTML element containing the board.
         */
        containerObj: HTMLDivElement;
        /**
         * Dimension of the board.
         */
        dimension: number;
        /**
         * Keep aspect ratio if bounding box is set and the width/height ratio differs from the width/height ratio of the canvas.
         */
        keepaspectratio: boolean;
        /**
         * JessieCode
         */
        jc: JessieCode;
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
         * The number of pixels which represent one unit in user-coordinates in x direction.
         */
        unitX: number;
        /**
         * The number of pixels which represent one unit in user-coordinates in y direction.
         */
        unitY: number;
        /**
         * Zoom factor in the X direction.
         */
        zoomX: number;
        /**
         * Zoom factor in the Y direction.
         */
        zoomY: number;
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
        create(elementType: ElementType, parents: any[], attributes: any): any;
        /**
         *
         */
        create(elementType: "angle", parents: [PointSpecification, PointSpecification, PointSpecification], attributes?: AngleAttributes): Angle;
        /**
         * centerPoint
         * radiusPoint
         * anglePoint
         */
        create(elementType: "arc", parents: [PointSpecification, PointSpecification, PointSpecification], attributes?: ArcAttributes): Arc;
        /**
         *
         */
        create(elementType: "arrow", parents?: [PointSpecification, PointSpecification], attributes?: ArrowAttributes): Arrow;
        /**
         *
         */
        create(elementType: "axis", parents?: [PointSpecification, PointSpecification] | [number, number, number], attributes?: AxisAttributes): Axis;
        /**
         *
         */
        create(elementType: "button", parents?: [CoordSpecification, CoordSpecification, string] | [CoordSpecification, CoordSpecification, string, HandlerFunction], attributes?: ButtonAttributes): Button;
        /**
         *
         */
        create(elementType: "chart", parents: number[], attributes?: ChartAttributes): Chart;
        /**
         *
         */
        create(elementType: "checkbox", parents?: [CoordSpecification, CoordSpecification, string], attributes?: CheckboxAttributes): Checkbox;
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
        create(elementType: "hatch", parents: [Line, number], attributes?: HatchAttributes): Hatch;
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
        create(elementType: "input", parents: [CoordSpecification, CoordSpecification, string, string], attributes?: InputAttributes): Input;
        /**
         *
         */
        create(elementType: "integral", parents: [[number, number], Curve], attributes?: IntegralAttributes): Integral;
        /**
         *
         */
        create(elementType: "line", parents: [PointSpecification, PointSpecification], attributes?: LineAttributes): Line;
        /**
         *
         */
        create(elementType: "plot", parents: [GEONExT], attributes?: CurveAttributes): Curve;
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
        create(elementType: "reflection", parents: [Point, Line], attributes?: ReflectionAttributes): Reflection;
        /**
         *
         */
        create(elementType: "riemannsum", parents: (CurveFunction | CurveFunction[] | StringFunction | string | BorderSpecification)[], attributes?: CurveAttributes): Riemannsum;
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
        create(elementType: "slopetriangle", parents: [Tangent] | [Line, Point], attributes?: SlopetriangleAttributes): Slopetriangle;
        /**
         *
         */
        create(elementType: "stepfunction", parents: [CoordSpecification[], CoordSpecification[]], attributes?: StepfunctionAttributes): Stepfunction;
        /**
         * Creates an instance of Tangent using a glider on a line, circle, or curve.
         */
        create(elementType: "tangent", parents?: [Glider], attributes?: TangentAttributes): Tangent;
        /**
         *
         */
        create(elementType: "tapemeasure", parents?: [PointSpecification, PointSpecification], attributes?: TapemeasureAttributes): Tapemeasure;
        /**
         *
         */
        create(elementType: "text", parents?: [number | NumberFunction, number | NumberFunction, string | StringFunction], attributes?: TextAttributes): Text;
        /**
         *
         */
        create(elementType: "ticks", parents: [Line] | [Line, number], attributes?: TicksAttributes): Ticks;
        /**
         *
         */
        create(elementType: "transform", parents: ((() => number) | Point)[], attributes?: TransformAttributes): Transform;
        /**
         *
         */
        create(elementType: "turtle", parents?: any[], attributes?: TurtleAttributes): Turtle;
        /**
         * 
         */
        emulateColorBlindness(deficiency: 'protanopia' | 'deuteranopia' | 'tritanopia'): Board;
        /**
         * 
         */
        setBoundingBox(bbox: [number, number, number, number], keepaspectratio?: boolean): Board;
        /**
         * Removes object from board and renderer.
         */
        removeObject(object: GeometryElement): Board;
        /**
         * 
         */
        setZoom(fX: number, fY: number): Board;
        /**
         * Cancels all running animations.
         */
        stopAllAnimation(): Board;
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
                 * Alias for keepAspectRatio.
                 */
                keepaspectratio?: boolean;

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
