/**
 * An action that is performed in the context of an <code>Editor</code>.
 */
export interface Action<TARGET> {
    (handler: TARGET, args?: any): void;
}
