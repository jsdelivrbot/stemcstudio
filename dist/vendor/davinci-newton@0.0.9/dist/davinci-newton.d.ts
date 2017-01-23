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
        getExpireTime(): number;
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
        evaluate(vars: number[], change: number[], timeStep: number): void;
        /**
         * 
         */
        getSimList(): SimList;
        /**
         * 
         */
        getVarsList(): VarsList;
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
        constructor();
        addVariables(names: string[], localNames: string[]): number;
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
    class Vector implements VectorE3 {
        x: number;
        y: number;
        z: number;
        static ORIGIN: Vector;
        constructor(x_: number, y_: number, z: number);
        add(rhs: VectorE3): Vector;
        subtract(rhs: VectorE3): Vector;
        multiply(alpha: number): Vector;
        distanceTo(rhs: VectorE3): number;
        immutable(): Vector;
        magnitude(): number;
        normalize(): Vector;
        rotate(cosAngle: number, sinAngle: number): Vector;
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
    class RigidBody implements SimObject {
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
        getExpireTime(): number;
        /**
         * 
         */
        rotationalEnergy(): number;
        /**
         * 
         */
        translationalEnergy(): number;
    }

    interface Collision {

    }

    enum CoordType {
        BODY = 0,
        WORLD = 1
    }

    /**
     * The application of a force to a particle in a rigid body.
     */
    class Force implements SimObject {
        /**
         * 
         */
        F: Vector;
        /**
         * 
         */
        x: Vector;
        /**
         * 
         */
        constructor(body: RigidBody);
        getBody(): RigidBody;
        getExpireTime(): number;
        setExpireTime(time: number): void;
    }

    interface ForceLaw extends SimObject {
        calculateForces(): Force[];
        disconnect(): void;
        getPotentialEnergy(): number;
    }

    class RigidBodySim implements Simulation {
        /**
         * Determines whether calculated forces will be added to the simulation list.
         */
        showForces: boolean;
        constructor();
        addBody(body: RigidBody): void;
        removeBody(body: RigidBody): void;
        addForceLaw(forceLaw: ForceLaw);
        removeForceLaw(forceLaw: ForceLaw);
        evaluate(vars: number[], change: number[], time: number): void;
        getTime();
        modifyObjects();
        getSimList(): SimList;
        getVarsList(): VarsList;
        saveState(): void;
        restoreState(): void;
        findCollisions(collisions: Collision[], vars: number[], stepSize: number): void;
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

    class SimpleAdvance implements AdvanceStrategy {
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
        constructor(advanceStrategy: AdvanceStrategy, name?: string);
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
    interface ForceBody {
        X: VectorE3;
        R: SpinorE3;
        varsIndex: number;
    }

    /**
     * 
     */
    interface Massive extends ForceBody {
        M: number;
    }

    /**
     * 
     */
    class GravitationLaw implements ForceLaw {
        /**
         * 
         */
        G: number;
        /**
         * 
         */
        constructor(body1: RigidBody, body2: RigidBody);
        calculateForces(): Force[];
        disconnect(): void;
        getExpireTime(): number;
        getPotentialEnergy(): number;
    }

    /**
     * 
     */
    class Spring implements ForceLaw {
        /**
         * 
         */
        constructor(body1: RigidBody, body2: RigidBody);
        calculateForces(): Force[];
        disconnect(): void;
        getExpireTime(): number;
        getPotentialEnergy(): number;
    }

    /**
     * 
     */
    interface AutoScale {

    }

    /**
     * 
     */
    interface GraphLine {
        setXVariable(index: number): void;
        setYVariable(index: number): void;
    }

    /**
     * 
     */
    class Graph {
        constructor(canvasId: string, varsList: VarsList);
        /**
         * 
         */
        addTrace(name: string): GraphLine;
        /**
         * 
         */
        memorize(): void;
        /**
         * 
         */
        render(): void;
        /**
         * 
         */
        setAutoScale(trace: GraphLine): AutoScale;
    }
}

declare module 'newton' {
    export = NEWTON;
}
