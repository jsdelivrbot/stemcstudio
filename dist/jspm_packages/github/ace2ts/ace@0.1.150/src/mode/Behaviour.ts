import BehaviourCallback from "../BehaviourCallback";

/**
 * @class Behaviour
 */
export default class Behaviour {

    /**
     * A map from name to a map from action to a BehaviourCallback.
     *
     * @property $behaviours
     * @type { [name: string]: { [action: string]: BehaviourCallback } }
     * @private
     */
    private $behaviours: { [name: string]: { [action: string]: BehaviourCallback } } = {};

    /**
     * @class Behaviour
     * @constructor
     */
    constructor() {
        // Do nothing.
    }

    /**
     * @method add
     * @param bName {string}
     * @param aName {string}
     * @param action {BehaviourCallback}
     * @return {void}
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
     * @method remove
     * @param bName {string}
     * @return {void}
     */
    remove(bName: string): void {
        if (this.$behaviours && this.$behaviours[bName]) {
            delete this.$behaviours[bName];
        }
    }

    /**
     * @method inherit
     * @param base {Behaviour}
     * @param [filter] {string[]}
     * @return {void}
     */
    inherit(base: Behaviour, filter?: string[]): void {
        const behaviours = base.getBehaviours(filter);
        this.addBehaviours(behaviours);
    }

    /**
     * @method getBehaviours
     */
    getBehaviours(filter?: string[]): { [name: string]: { [action: string]: BehaviourCallback } } {
        if (!filter) {
            return this.$behaviours;
        }
        else {
            const ret: { [name: string]: { [action: string]: BehaviourCallback } } = {};
            for (var i = 0; i < filter.length; i++) {
                if (this.$behaviours[filter[i]]) {
                    ret[filter[i]] = this.$behaviours[filter[i]];
                }
            }
            return ret;
        }
    }
}
