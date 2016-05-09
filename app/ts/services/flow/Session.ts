/**
 * 
 */
interface Session<T> {
    /**
     * 
     */
    execute(callback: (reason: any, facts: T) => any): void;
}

export default Session;
