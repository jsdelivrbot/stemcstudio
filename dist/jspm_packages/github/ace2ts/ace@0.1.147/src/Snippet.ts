/**
 * @class Snippet
 */
interface Snippet {

    /**
     * @property content
     * @type string
     */
    content?: string;

    /**
     * @property endGuard
     * @type string
     */
    endGuard?: string;

    /**
     * @property endRe
     * @type RegExp
     */
    endRe?: RegExp;

    /**
     * @property endTrigger
     * @type string
     */
    endTrigger?: string;

    /**
     * @property endTriggerRe
     * @type RegExp
     */
    endTriggerRe?: RegExp;

    /**
     * @property guard
     * @type string
     */
    guard?: string;

    /**
     * @property matchAfter
     */
    matchAfter?: any;

    /**
     * @property matchBefore
     */
    matchBefore?: any;

    /**
     * @property name
     * @type string
     */
    name?: string;

    /**
     * @property replaceAfter
     */
    replaceAfter?: any;

    /**
     * @property replaceBefore
     */
    replaceBefore?: any;

    /**
     * @property scope
     * @type string
     */
    scope?: string;

    /**
     * @property startRe
     * @type RegExp
     */
    startRe?: RegExp;

    /**
     * @property tabTrigger
     * @type string
     */
    tabTrigger?: string;

    /**
     * @property trigger
     * @type string
     */
    trigger?: string;

    /**
     * @property triggerRe
     * @type RegExp
     */
    triggerRe?: RegExp;
}

export default Snippet;