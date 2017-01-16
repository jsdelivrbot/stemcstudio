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
        add(simObj: SimObject): void;
        remove(simObj: SimObject): void;
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

    class RigidBody implements SimObject {
        constructor(name: string);
        eraseOldCopy(): void;
        getName(): string;
        getExpireTime(): number;
        getVarsIndex(): number;
        setVarsIndex(index: number): void;
        getVarName(index: number, localized: boolean): string;
        getPosition(): VectorE3;
        setPosition(x: number, y: number, z: number): void;
        getAttitude(): number;
        setAttitude(angle?: number): void;
        getVelocity(): VectorE3;
        setVelocity(x: number, y: number, z: number): void;
        getAngularVelocity(): number;
        setAngularVelocity(angularVelocity?: number): void;
        getMass(): number;
        setMass(mass: number): void;
        momentAboutCM(): number;
        rotationalEnergy(): number;
        translationalEnergy(): number;
        saveOldCopy(): void;
    }

    interface Collision {

    }

    enum CoordType {
        BODY = 0,
        WORLD = 1
    }

    class Force implements SimObject {
        /**
         * 
         */
        constructor(name: string,
            body: RigidBody,
            location: Vector,
            locationCoordType: CoordType,
            direction: Vector,
            directionCoordType: CoordType,
            torque?: number);
        getName(): string;
        getBody(): RigidBody;
        getVector(): Vector;
        getStartPoint(): Vector;
        getTorque(): number;
        getExpireTime(): number;
        setExpireTime(time: number): void;
    }

    interface ForceLaw {
        calculateForces(): Force[];
        disconnect(): void;
        getPotentialEnergy(): number;
    }

    class RigidBodySim implements Simulation {
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
        calculateForces(): Force[];
        disconnect(): void;
        getPotentialEnergy(): number;
        getVector(): Vector;
    }
}

declare module 'newton' {
    export = NEWTON;
}
