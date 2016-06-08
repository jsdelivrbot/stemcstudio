/**
 * Standardize the interface for objects such as singleton services.
 */
interface Disposable {
    recycle(): void;
    dispose(): void;
}

export default Disposable;
