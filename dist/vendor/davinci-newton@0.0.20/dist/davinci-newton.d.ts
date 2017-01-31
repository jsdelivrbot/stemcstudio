//
// davinci-newton.d.ts
//
// This file was created manually in order to support the davinci-newton library.
// These declarations are appropriate when using the library through the global
// variable, 'NEWTON'.
//
/**
 * JavaScript Physics Engine library for mathematical physics using Geometric Algebra.
 */
declare module NEWTON {

    interface SimObject {
        /**
         * 
         */
        expireTime: number;
    }

    class SimList {
        constructor();
        add(simObject: SimObject): void;
        forEach(callBack: (simObject: SimObject, index: number) => any): void;
        remove(simObject: SimObject): void;
        removeTemporary(time: number): void;
    }

    interface Simulation {
        /**
         * 
         */
        time: number;
        /**
         * Handler for actions to be performed before getState and the evaluate calls.
         */
        prolog(): void;
        /**
         * 
         */
        getState(): number[];
        /**
         * 
         */
        evaluate(vars: number[], change: number[], timeStep: number): void;
        /**
         * 
         */
        setState(vars: number[]): void;
        /**
         * Handler for actions to be performed after the evaluate calls and setState.
         */
        epilog(): void;
    }

    class VarsList {
        constructor(varNames: string[]);
        addVariables(names: string[]): number;
        deleteVariables(index: number, howMany: number): void;
        incrSequence(...indexes: number[]);
        getValues(): number[];
        setValues(values: number[], continuous?: boolean): void;
        setValue(index: number, value: number, continuous?: boolean): void;
        getTime(): number;
        timeIndex(): number;
    }

    /**
     * An immutable implementation of a vector with cartesian coordinates in 3D.
     */
    class Vec3 implements VectorE3 {
        /**
         * 
         */
        static ORIGIN: Vec3;
        /**
         * 
         */
        constructor(x: number, y: number, z: number);
        /**
         * x coordinate.
         */
        x: number;
        /**
         * y coordinate.
         */
        y: number;
        /**
         * z coordinate.
         */
        z: number;
        add(rhs: VectorE3): Vec3;
        cross(rhs: VectorE3): Vec3;
        direction(): Vec3;
        distanceTo(point: VectorE3): number;
        divByScalar(alpha: number): Vec3;
        lco(B: BivectorE3): Vec3;
        magnitude(): number;
        mulByScalar(alpha: number): Vec3;
        nearEqual(v: VectorE3, tolerance?: number): boolean;
        // normalize(): Vec3;
        rotate(spinor: SpinorE3): Vec3;
        subtract(rhs: VectorE3): Vec3;
        toString(radix?: number): string;
        static fromVector(v: VectorE3): Vec3;
    }

    /**
     * A mutable implementation of a vector with cartesian coordinates in 3D.
     */
    class Vector3 implements VectorE3 {
        /**
         * 
         */
        constructor(x?: number, y?: number, z?: number);
        /**
         * 
         */
        x: number;
        /**
         * 
         */
        y: number;
        /**
         * 
         */
        z: number;
        add(rhs: VectorE3): this;
        applyMatrix(σ: MatrixLike): this;
        copy(source: VectorE3): this;
        direction(): this;
        distanceTo(point: VectorE3): number;
        divByScalar(alpha: number): this;
        dot(v: VectorE3): number;
        dual(B: BivectorE3): this;
        isZero(): boolean;
        magnitude(): number;
        neg(): this;
        quaditude(): number;
        quadranceTo(point: VectorE3): number;
        rotate(spinor: SpinorE3): this;
        subtract(rhs: VectorE3): this;
        toString(radix?: number): string;
        write(destination: VectorE3): this;
        zero(): this;
        /**
         * Constructs a vector by computing the dual of a bivector.
         */
        static dual(B: BivectorE3): Vector3;
    }

    interface VectorE3 {
        x: number;
        y: number;
        z: number;
    }

    interface BivectorE3 {
        yz: number;
        zx: number;
        xy: number;
    }

    /**
     * A mutable implementation of a bivector with cartesian coordinates in 3D.
     */
    class Bivector3 implements BivectorE3 {
        yz: number;
        zx: number;
        xy: number;
        applyMatrix(m: MatrixLike): this;
        copy(B: BivectorE3): this;
        isZero(): boolean;
        toString(radix?: number): string;
        wedge(a: VectorE3, b: VectorE3): this;
        write(B: BivectorE3): this;
        zero(): this;
    }


    interface SpinorE3 extends BivectorE3 {
        a: number;
    }

    /**
     * A mutable implementation of a spinor with cartesian coordinates in 3D.
     */
    class Spinor3 implements SpinorE3 {
        constructor(a?: number, xy?: number, yz?: number, zx?: number);
        a: number;
        yz: number;
        zx: number;
        xy: number;
        copy(spinor: SpinorE3): this;
        divByScalar(alpha: number): this;
        isOne(): boolean;
        magnitude(): number;
        normalize(): this;
        one(): this;
    }

    interface MatrixLike {
        dimensions: number;
        getElement(row: number, column: number): number;
    }

    /**
     * A mutable 3x3 matrix.
     */
    class Matrix3 implements MatrixLike {
        dimensions: number;
        elements: Float32Array;
        modified: boolean;
        /**
         * Constructs a mutable 3x3 identity matrix.
         */
        constructor(elements?: Float32Array);
        copy(source: MatrixLike): this;
        getElement(row: number, column: number): number;
        inv(): this;
        isOne(): boolean;
        mul(rhs: Matrix3): this;
        mul2(a: Matrix3, b: Matrix3): this;
        rmul(lhs: Matrix3): this;
        rotation(spinor: SpinorE3): this;
        row(i: number): number[];
        setElement(row: number, column: number, value: number): void;
        toString(radix?: number): string;
        transpose(): this;
        static one(): Matrix3;
        static zero(): Matrix3;
    }

    /**
     * 
     */
    class RigidBody3 implements SimObject {
        /**
         * The center of mass position vector in local coordinates.
         */
        centerOfMassLocal: VectorE3;
        /**
         * Mass (scalar).
         */
        M: number;
        /**
         * Inertia Tensor (in body coordinates) (3x3 matrix).
         */
        I: MatrixLike;
        /**
         * Inertia Tensor (in body coordinates) inverse (3x3 matrix).
         */
        Iinv: MatrixLike;
        /**
         * Position (vector).
         */
        X: Vector3;
        /**
         * Attitude (spinor)
         */
        R: Spinor3;
        /**
         * Linear momentum (vector).
         */
        P: Vector3;
        /**
         * Angular momentum (bivector).
         */
        L: Bivector3;
        /**
         * Angular velocity (bivector).
         */
        Ω: Bivector3;
        /**
         * 
         */
        expireTime: number;
        /**
         * The starting index of this rigid body in the state variables.
         */
        varsIndex: number;
        /**
         * 
         */
        constructor();
        /**
         * Converts a point in local coordinates to the same point in world coordinates.
         * x = R (localPoint - centerOfMassLocal) * ~R + X
         */
        localPointToWorldPoint(localPoint: VectorE3, worldPoint: VectorE3): void;
        /**
         * Updates the angular velocity, Ω, bivector based upon the angular momentum.
         * Derived classes may override to provide more efficient implementations based upon symmetry.
         */
        public updateAngularVelocity(): void;
        /**
         * 
         */
        protected updateInertiaTensor(): void;
        /**
         * 
         */
        rotationalEnergy(): number;
        /**
         * 
         */
        translationalEnergy(): number;
    }

    /**
     * A rectangular block of uniform density.
     */
    class Block3 extends RigidBody3 {
        width: number;
        height: number;
        depth: number;
        constructor(width?: number, height?: number, depth?: number);
    }

    /**
     * A solid cylinder of uniform density.
     */
    class Cylinder3 extends RigidBody3 {
        radius: number;
        height: number;
        constructor(radius?: number, height?: number);
    }

    /**
     * A solid sphere of uniform density.
     */
    class Sphere3 extends RigidBody3 {
        radius: number;
        constructor(radius?: number);
    }

    enum CoordType {
        BODY = 0,
        WORLD = 1
    }

    /**
     * The application of a force to a particle in a rigid body.
     */
    class Force3 implements SimObject {
        /**
         * 
         */
        F: Vec3;
        /**
         * 
         */
        x: Vec3;
        /**
         * 
         */
        expireTime: number;
        /**
         * 
         */
        constructor(body: RigidBody3);
        getBody(): RigidBody3;
    }

    interface ForceLaw3 extends SimObject {
        updateForces(): Force3[];
        disconnect(): void;
        potentialEnergy(): number;
    }

    /**
     * 
     */
    class Physics3 implements Simulation, EnergySystem {
        static INDEX_TIME: number;
        static INDEX_TRANSLATIONAL_KINETIC_ENERGY: number;
        static INDEX_ROTATIONAL_KINETIC_ENERGY: number;
        static INDEX_POTENTIAL_ENERGY: number;
        static INDEX_TOTAL_ENERGY: number;
        static INDEX_TOTAL_LINEAR_MOMENTUM_X: number;
        static INDEX_TOTAL_LINEAR_MOMENTUM_Y: number;
        static INDEX_TOTAL_LINEAR_MOMENTUM_Z: number;
        static INDEX_TOTAL_ANGULAR_MOMENTUM_YZ: number;
        static INDEX_TOTAL_ANGULAR_MOMENTUM_ZX: number;
        static INDEX_TOTAL_ANGULAR_MOMENTUM_XY: number;
        static OFFSET_POSITION_X: number;
        static OFFSET_POSITION_Y: number;
        static OFFSET_POSITION_Z: number;
        static OFFSET_ATTITUDE_A: number;
        static OFFSET_ATTITUDE_YZ: number;
        static OFFSET_ATTITUDE_ZX: number;
        static OFFSET_ATTITUDE_XY: number;
        static OFFSET_LINEAR_MOMENTUM_X: number;
        static OFFSET_LINEAR_MOMENTUM_Y: number;
        static OFFSET_LINEAR_MOMENTUM_Z: number;
        static OFFSET_ANGULAR_MOMENTUM_YZ: number;
        static OFFSET_ANGULAR_MOMENTUM_ZX: number;
        static OFFSET_ANGULAR_MOMENTUM_XY: number;
        /**
         * 
         */
        simList: SimList;
        /**
         * 
         */
        varsList: VarsList;
        /**
         * Determines whether calculated forces will be added to the simulation list.
         */
        showForces: boolean;
        /**
         * 
         */
        time: number;
        /**
         *
         */
        constructor();
        addBody(body: RigidBody3): void;
        removeBody(body: RigidBody3): void;
        addForceLaw(forceLaw: ForceLaw3): void;
        removeForceLaw(forceLaw: ForceLaw3): void;
        prolog(): void;
        getState(): number[];
        evaluate(state: number[], change: number[], timeOffset: number): void;
        setState(state: number[]): void;
        epilog(): void;
        totalEnergy(): number;
        // saveState(): void;
        // restoreState(): void;
        // findCollisions(collisions: Collision[], vars: number[], stepSize: number): void;
    }

    interface DiffEqSolver {
        step(stepSize: number): void;
    }

    /**
     * 
     */
    class EulerMethod implements DiffEqSolver {
        constructor(simulation: Simulation);
        step(stepSize: number): void;
    }

    /**
     * 
     */
    class ModifiedEuler implements DiffEqSolver {
        constructor(simulation: Simulation);
        step(stepSize: number): void;
    }

    /**
     * 
     */
    class RungeKutta implements DiffEqSolver {
        constructor(simulation: Simulation);
        step(stepSize: number): void;
    }

    interface EnergySystem {
        totalEnergy(): number;
    }

    class AdaptiveStepSolver implements DiffEqSolver {
        /**
         * Whether to use second order differences for deciding when to reduce the step size.
         * The first difference is the change in energy of the system over a time step.
         * We can only use first differences when the energy of the system is constant.
         * If the energy of the system changes over time, then we need to reduce the step size
         * until the change of energy over the step stabilizes.  Put another way:  we reduce
         * the step size until the change in the change in energy becomes small.
         * true means use *change in change in energy* (second derivative)
         * as the criteria for accuracy
         */
        secondDiff: boolean;
        /**
         * The smallest time step that will executed.
         * Setting a reasonable lower bound prevents the solver from taking too long to give up.
         * This value may be reduced incrementally to improve the accuracy.
         * Default is 1E-5;
         */
        stepLBound: number;
        /**
         * Returns the tolerance used to decide if sufficient accuracy has been achieved.
         * Default is 1E-6.
         */
        tolerance: number;
        /**
         * 
         */
        constructor(diffEq: Simulation, energySystem: EnergySystem, diffEqSolver: DiffEqSolver);
        step(stepSize: number): void;
    }

    interface MemoList {
        memorize(): void;
    }

    interface AdvanceStrategy {
        /**
         * 
         */
        advance(timeStep: number, memoList?: MemoList): void;
        /**
         * 
         */
        getTime(): number;
        /**
         * 
         */
        getTimeStep(): number;
    }

    class DefaultAdvanceStrategy implements AdvanceStrategy {
        /**
         * 
         */
        constructor(simulation: Simulation, solver: DiffEqSolver);
        advance(timeStep: number, memoList?: MemoList);
        getTime(): number;
        getTimeStep(): number;
    }

    /**
     * 
     */
    class Clock {

        /**
         * 
         */
        constructor();

        /**
         * 
         */
        resume(): void;
    }

    class SimRunner {
        /**
         * 
         */
        constructor(advanceStrategy: AdvanceStrategy);
        /**
         * 
         */
        getClock(): Clock;
        /**
         * 
         */
        update(): void;
        /**
         * 
         */
        memorize(): void;
    }

    /**
     * 
     */
    interface ForceBody3 {
        X: VectorE3;
        R: SpinorE3;
        varsIndex: number;
    }

    /**
     * 
     */
    interface Massive3 extends ForceBody3 {
        M: number;
    }

    class ConstantForceLaw3 implements ForceLaw3 {
        /**
         * 
         */
        expireTime: number;
        /**
         * The attachment point to the body in body coordinates.
         */
        location: VectorE3;
        /**
         * 
         */
        constructor(body: RigidBody3, vector: VectorE3, vectorCoordType?: CoordType);
        /**
         * 
         */
        updateForces(): Force3[];
        /**
         * 
         */
        disconnect(): void;
        /**
         * 
         */
        potentialEnergy(): number;
    }

    /**
     * 
     */
    class GravitationLaw3 implements ForceLaw3 {
        /**
         * 
         */
        G: number;
        /**
         * 
         */
        expireTime: number;
        /**
         * 
         */
        constructor(body1: RigidBody3, body2: RigidBody3);
        updateForces(): Force3[];
        disconnect(): void;
        potentialEnergy(): number;
    }

    /**
     * 
     */
    class Spring3 implements ForceLaw3 {
        /**
         * 
         */
        attach1: VectorE3;
        /**
         * 
         */
        attach2: VectorE3;
        /**
         * 
         */
        end1: Vec3;
        /**
         * 
         */
        end2: Vec3;
        /**
         * 
         */
        expireTime: number;
        /**
         * 
         */
        constructor(body1: RigidBody3, body2: RigidBody3);
        updateForces(): Force3[];
        disconnect(): void;
        potentialEnergy(): number;
    }

    class DoubleRect {

    }

    class SimView {

    }

    /**
     * 
     */
    enum AxisChoice {
        HORIZONTAL = 1,
        VERTICAL = 2,
        BOTH = 3
    }

    /**
     * 
     */
    class AutoScale {
        /**
         * 
         */
        active: boolean;
        /**
         * 
         */
        axisChoice: AxisChoice;
        /**
         * 
         */
        enabled: boolean;
        /**
         * 
         */
        timeWindow: number;
        /**
         * 
         */
        constructor(view: SimView);
        /**
         * 
         */
        addGraphLine(graphLine: GraphLine): void;
        /**
         * 
         */
        clearRange(): void;
        /**
         * 
         */
        getRangeRect(): DoubleRect;
        /**
         * 
         */
        memorize(): void;
        // observe(event: SubjectEvent): void;
        /**
         * 
         */
        removeGraphLine(graphLine: GraphLine): void;
        /**
         * 
         */
        reset(): void;
    }

    enum AlignH {
        LEFT = 0,
        MIDDLE = 1,
        RIGHT = 2,
        FULL = 3
    }


    enum AlignV {
        TOP = 0,
        MIDDLE = 1,
        BOTTOM = 2,
        FULL = 3
    }

    /**
     * 
     */
    class DisplayAxes {
        /**
         * 
         */
        color: string;
        /**
         * The label for the horizontal axis.
         */
        hAxisLabel: string;
        /**
         * The label for the vertical axis.
         */
        vAxisLabel: string;
        /**
         * The alignment for the horizontal axis.
         */
        hAxisAlign: AlignV;
        /**
         * The alignment for the vertical axis.
         */
        vAxisAlign: AlignH;
    }

    /**
     * 
     */
    enum DrawingMode {
        DOTS = 0,
        LINES = 1
    }

    /**
     * 
     */
    interface GraphLine {
        /**
         * 
         */
        color: string;
        /**
         * 
         */
        drawingMode: DrawingMode;
        /**
         * The variable index used for the horizontal coordinate.
         */
        hCoordIndex: number;
        /**
         * 
         */
        hotspotColor: string;
        /**
         * 
         */
        lineWidth: number;
        /**
         * 
         */
        varsList: VarsList;
        /**
         * The variable index used for the vertical coordinate.
         */
        vCoordIndex: number;
        /**
         * 
         */
        // getGraphPoints(): CircularList<GraphPoint>;
        // getGraphStyle(index: number): GraphStyle;
        /**
         * 
         */
        getXVarName(): string;
        /**
         * 
         */
        getYVarName(): string;
        reset(): void;
        resetStyle(): void;
    }

    /**
     * 
     */
    class Graph {
        /**
         * 
         */
        autoScale: AutoScale;
        /**
         * 
         */
        axes: DisplayAxes;
        /**
         * 
         */
        constructor(canvasId: string, varsList: VarsList);
        /**
         * 
         */
        addGraphLine(hCoordIndex: number, vCoordIndex: number, color?: string): GraphLine;
        /**
         * 
         */
        memorize(): void;
        /**
         * 
         */
        removeGraphLine(graphLine: GraphLine): void;
        /**
         * 
         */
        render(): void;
        /**
         * 
         */
        reset(): void;
    }
}

declare module 'newton' {
    export = NEWTON;
}
