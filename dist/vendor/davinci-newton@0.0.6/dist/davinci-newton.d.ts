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
        /**
         * 
         */
        getName(localized?: boolean): string;
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

    interface SpinorE3 extends BivectorE3 {
        a: number;
    }

    class RigidBody implements SimObject {
        /**
         * Position.
         */
        X: VectorE3;
        /**
         * Attitude (spinor)
         */
        R: SpinorE3;
        /**
         * Linear Momentum.
         */
        P: VectorE3;
        /**
         * 
         */
        constructor(name: string);
        getName(): string;
        getExpireTime(): number;
        getVarsIndex(): number;
        setVarsIndex(index: number): void;
        getAngularVelocity(): number;
        setAngularVelocity(angularVelocity?: number): void;
        getMass(): number;
        setMass(mass: number): void;
        momentAboutCM(): number;
        rotationalEnergy(): number;
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
    class ForceApp implements SimObject {
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
        constructor(name: string,
            body: RigidBody,
            location: Vector,
            locationCoordType: CoordType,
            direction: Vector,
            directionCoordType: CoordType);
        getName(): string;
        getBody(): RigidBody;
        getExpireTime(): number;
        setExpireTime(time: number): void;
    }

    interface ForceLaw {
        calculateForces(): ForceApp[];
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
    class Spring implements ForceLaw {
        /**
         * 
         */
        constructor(name: string, body1: RigidBody, body2: RigidBody);
        getName(): string;
        getStartPoint(): Vector;
        getEndPoint(): Vector;
        getExpireTime(): number;
        calculateForces(): ForceApp[];
        disconnect(): void;
        getPotentialEnergy(): number;
        getVector(): Vector;
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
