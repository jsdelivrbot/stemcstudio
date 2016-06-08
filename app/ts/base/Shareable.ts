/**
 * Reference counting to manage lifetime of shared objects.
 */
interface Shareable {
    addRef(): number;
    release(): number;
}

export default Shareable;
