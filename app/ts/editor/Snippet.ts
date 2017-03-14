/**
 *
 */
interface Snippet {

    /**
     * 
     */
    content: string;

    /**
     *
     */
    endRe?: RegExp;

    /**
     * The begin marker for a Trigger (optional).
     */
    trigger?: string;

    /**
     * The end marker for a Trigger (optional)
     */
    endTrigger?: string;

    /**
     *
     */
    endTriggerRe?: RegExp;

    /**
     * The begin marker for a Guard (optional).
     */
    guard?: string;

    /**
     * The end marker for a Guard (optional).
     */
    endGuard?: string;

    /**
     *
     */
    matchAfter?: RegExpExecArray | string[];

    /**
     *
     */
    matchBefore?: RegExpExecArray | string[];

    /**
     *
     */
    name?: string;

    /**
     *
     */
    replaceAfter?: string;

    /**
     *
     */
    replaceBefore?: string;

    /**
     *
     */
    scope?: string;

    /**
     *
     */
    startRe?: RegExp;

    /**
     *
     */
    tabTrigger?: string;

    /**
     *
     */
    triggerRe?: RegExp;
}

export default Snippet;
