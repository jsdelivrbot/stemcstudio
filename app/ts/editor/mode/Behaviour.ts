import { BehaviourCallback } from "../BehaviourCallback";

/**
 *
 */
export class Behaviour {

    /**
     * A map from name to a map from action to a BehaviourCallback.
     */
    private $behaviours: { [name: string]: { [action: string]: BehaviourCallback } } = {};

    /**
     *
     */
    constructor() {
        // Do nothing.
    }

    /**
     * @param bName
     * @param aName
     * @param action
     */
    add(bName: string, aName: string, action: BehaviourCallback): void {
        if (!this.$behaviours) {
            this.$behaviours = {};
        }
        if (!this.$behaviours[bName]) {
            this.$behaviours[bName] = {};
        }
        this.$behaviours[bName][aName] = action;
    }

    addBehaviours(behaviours: { [behaviourName: string]: { [actionName: string]: BehaviourCallback } }): void {
        const bNames = Object.keys(behaviours);
        const bLen = bNames.length;
        for (let b = 0; b < bLen; b++) {
            const bName = bNames[b];
            const actions = behaviours[bName];
            const aNames = Object.keys(actions);
            const aLen = aNames.length;
            for (let a = 0; a < aLen; a++) {
                const aName = aNames[a];
                const action = actions[aName];
                this.add(bName, aName, action);
            }
        }
    }

    /**
     * @param bName
     */
    remove(bName: string): void {
        if (this.$behaviours && this.$behaviours[bName]) {
            delete this.$behaviours[bName];
        }
    }

    /**
     * @param base
     * @param filter
     */
    inherit(base: Behaviour, filter?: string[]): void {
        const behaviours = base.getBehaviours(filter);
        this.addBehaviours(behaviours);
    }

    /**
     * @param filter An optional list of behaviour names.
     * @return behaviourName to action to BehaviorCallaback
     */
    getBehaviours(filter?: string[]): { [name: string]: { [action: string]: BehaviourCallback } } {
        if (!filter) {
            return this.$behaviours;
        }
        else {
            const ret: { [name: string]: { [action: string]: BehaviourCallback } } = {};
            for (let i = 0; i < filter.length; i++) {
                if (this.$behaviours[filter[i]]) {
                    ret[filter[i]] = this.$behaviours[filter[i]];
                }
            }
            return ret;
        }
    }
}
