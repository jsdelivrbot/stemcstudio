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
        /**
         * 
         */
        isMassObject(): boolean;
        /**
         * Returns true if the given SimObject is similar to this SimObject for display purposes.
         * SimObjects are similar when they are the same type and nearly the same size and location.
         * Mainly used when showing forces - to avoid adding too many objects to the display.
         */
        similar(obj: SimObject, tolerance?: number): boolean;
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

    class Vector implements GenericVector {
        static ORIGIN: Vector;
        constructor(x_: number, y_: number, z: number);
        getX(): number;
        getY(): number;
        getZ(): number;
        add(rhs: GenericVector): Vector;
        subtract(rhs: GenericVector): Vector;
        multiply(alpha: number): Vector;
        distanceTo(rhs: GenericVector): number;
        immutable(): Vector;
        length(): number;
        normalize(): Vector;
        rotate(cosAngle: number, sinAngle: number): Vector;
    }

    interface GenericVector {
        getX(): number;
        getY(): number;
        getZ(): number;
        immutable(): Vector;
    }

    interface RigidBody extends SimObject {
        eraseOldCopy(): void;
        getVarsIndex(): number;
        setVarsIndex(index: number): void;
        getVarName(index: number, localized: boolean): string;
        getAngle(): number;
        getAngularVelocity(): number;
        getPosition(): GenericVector;
        setPosition(worldLocation: GenericVector, angle?: number): void;
        getVelocity(): GenericVector;
        setVelocity(worldVelocity: GenericVector, angularVelocity?: number): void;
        getMass(): number;
        momentAboutCM(): number;
        rotationalEnergy(): number;
        translationalEnergy(): number;
        saveOldCopy(): void;
    }

    interface Collision {

    }

    interface MassObject {
        bodyToWorld(point: GenericVector): Vector;
        getVelocity(point: GenericVector): Vector;
        rotateBodyToWorld(body: GenericVector): Vector;
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
            body: MassObject,
            location: Vector,
            locationCoordType: CoordType,
            direction: Vector,
            directionCoordType: CoordType,
            torque?: number);
        getName(): string;
        getBody(): MassObject;
        getVector(): Vector;
        getStartPoint(): Vector;
        getTorque(): number;
        isMassObject(): boolean;
        getExpireTime(): number;
        setExpireTime(time: number): void;
        similar(obj: SimObject, tolerance?: number): boolean;
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
}

declare module 'newton' {
    export = NEWTON;
}
