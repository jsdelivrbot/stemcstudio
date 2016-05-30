/**
 *
 */
interface Snippet {

    /**
     *
     */
    content?: string;

    /**
     *
     */
    endGuard?: string;

    /**
     *
     */
    endRe?: RegExp;

    /**
     *
     */
    endTrigger?: string;

    /**
     *
     */
    endTriggerRe?: RegExp;

    /**
     *
     */
    guard?: string;

    /**
     *
     */
    matchAfter?: any;

    /**
     *
     */
    matchBefore?: any;

    /**
     *
     */
    name?: string;

    /**
     *
     */
    replaceAfter?: any;

    /**
     *
     */
    replaceBefore?: any;

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
    trigger?: string;

    /**
     *
     */
    triggerRe?: RegExp;
}

export default Snippet;
