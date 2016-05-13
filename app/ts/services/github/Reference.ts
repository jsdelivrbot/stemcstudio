/**
 * A Git Reference provides a human-readable alias for a SHA value.
 * 
 * Most of the time, a reference will be used to identify a Commit object.
 */
interface Reference {
    ref: string;
    url: string;
    object: {
        sha: string;
        type: string;
        url: string;
    };
}

export default Reference;
