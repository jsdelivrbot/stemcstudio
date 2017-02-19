import IOption from '../../services/options/IOption';

interface PropertiesModalScope {

    /**
     * form
     */
    f: {
        /**
         * name
         */
        n: string;
        /**
         * version
         */
        v: string;
        /**
         * operatorOverloading
         */
        o: boolean;
        /**
         * dependency (name only)
         */
        dependencies: string[];
    };
    toggleDependency(name: string): void;
    options: IOption[];
    ok(): void;
    submit(): void;
    cancel(): void;
}

export default PropertiesModalScope;
