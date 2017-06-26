/**
 * Reference counting to manage lifetime of shared objects.
 */
export interface Shareable {
    addRef(): number;
    release(): number;
}
