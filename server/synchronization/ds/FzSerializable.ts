/**
 * 
 */
export interface FzSerializable<F> {
    dehydrate(): F;
    rehydrate(value: F): void;
}
