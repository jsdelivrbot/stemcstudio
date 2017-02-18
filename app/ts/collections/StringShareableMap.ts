import Shareable from '../base/Shareable';

/**
 * A map from string to a parameterized type that is shareable.
 */
export default class StringShareableMap<V extends Shareable> implements Shareable {

    private elements: { [key: string]: V };
    private refCount: number;

    constructor() {
        this.elements = {};
        this.refCount = 1;
    }

    addRef(): number {
        this.refCount++;
        return this.refCount;
    }

    release(): number {
        this.refCount--;
        if (this.refCount === 0) {
            this.destructor();
        }
        else if (this.refCount < 0) {
            throw new Error();
        }
        return this.refCount;
    }

    protected destructor(): void {
        this.forEach((key: string) => {
            this.putWeakRef(key, void 0);
        });
        this.elements = void 0;
    }

    /**
     * Determines whether the key exists in the map with a defined value.
     *
     * @param key
     * @returns <p><code>true</code> if there is an element at the specified key.</p>
     */
    public exists(key: string): boolean {
        const element = this.elements[key];
        return element ? true : false;
    }

    /**
     *
     */
    public get(key: string): V {
        const element = this.elements[key];
        if (element) {
            element.addRef();
            return element;
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    public getWeakRef(key: string): V {
        return this.elements[key];
    }

    /**
     *
     */
    public put(key: string, value: V): void {
        if (value) {
            value.addRef();
        }
        this.putWeakRef(key, value);
    }

    /**
     *
     */
    public putWeakRef(key: string, value: V): void {
        const elements = this.elements;
        const existing = elements[key];
        if (existing) {
            existing.release();
        }
        elements[key] = value;
    }

    /**
     *
     */
    public forEach(callback: (key: string, value: V) => void): void {
        const keys: string[] = this.keys;
        for (let i = 0, iLength = keys.length; i < iLength; i++) {
            let key: string = keys[i];
            callback(key, this.elements[key]);
        }
    }

    /**
     *
     */
    get keys(): string[] {
        return Object.keys(this.elements);
    }

    /**
     *
     */
    get values(): V[] {
        const values: V[] = [];
        const keys: string[] = this.keys;
        for (let i = 0, iLength = keys.length; i < iLength; i++) {
            let key: string = keys[i];
            values.push(this.elements[key]);
        }
        return values;
    }

    /**
     *
     */
    public remove(key: string): V {
        const value = this.elements[key];
        delete this.elements[key];
        return value;
    }
}
