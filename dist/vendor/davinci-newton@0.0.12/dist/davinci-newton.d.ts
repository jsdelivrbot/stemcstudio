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
        simList: SimList;
        /**
         * 
         */
        varsList: VarsList;
        /**
         * 
         */
        evaluate(vars: number[], change: number[], timeStep: number): void;
        /**
         * 
         */
        saveState(): void;
        /**
         * 
         */
        restoreState(): void;
        /**
         * 
         */
        getTime(): number;
        /**
         * 
         */
        modifyObjects(): void;
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
         * readonly x coordinate.
         */
        x: number;
        /**
         * readonly y coordinate.
         */
        y: number;
        /**
         * readonly z coordinate.
         */
        z: number;
        static ORIGIN: Vec3;
        constructor(x: number, y: number, z: number);
        add(rhs: VectorE3): Vec3;
        subtract(rhs: VectorE3): Vec3;
        multiply(alpha: number): Vec3;
        distanceTo(rhs: VectorE3): number;
        immutable(): Vec3;
        magnitude(): number;
        normalize(): Vec3;
        rotate(cosAngle: number, sinAngle: number): Vec3;
    }

    /**
     * A mutable implementation of a vector with cartesian coordinates in 3D.
     */
    class Vector3 implements VectorE3 {
        x: number;
        y: number;
        z: number;
        constructor(x?: number, y?: number, z?: number);
        copy(source: VectorE3): this;
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
    }


    interface SpinorE3 extends BivectorE3 {
        a: number;
    }

    /**
     * A mutable implementation of a spinor with cartesian coordinates in 3D.
     */
    class Spinor3 implements SpinorE3 {
        a: number;
        yz: number;
        zx: number;
        xy: number;
    }

    /**
     * 
     */
    class RigidBody3 implements SimObject {
        /**
         * Mass (scalar).
         */
        M: number;
        /**
         * Position (vector).
         */
        X: Vector3;
        /**
         * Attitude (spinor)
         */
        R: Spinor3;
        /**
         * Linear Momentum (vector).
         */
        P: Vector3;
        /**
         * Angular Momentum (bivector).
         */
        L: Bivector3;
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
         * 
         */
        rotationalEnergy(): number;
        /**
         * 
         */
        translationalEnergy(): number;
    }

    /*
    interface Collision {

    }
    */

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
    class Physics3 implements Simulation {
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
        constructor();
        addBody(body: RigidBody3): void;
        removeBody(body: RigidBody3): void;
        addForceLaw(forceLaw: ForceLaw3): void;
        removeForceLaw(forceLaw: ForceLaw3): void;
        evaluate(vars: number[], change: number[], time: number): void;
        getTime(): number;
        modifyObjects(): void;
        saveState(): void;
        restoreState(): void;
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
