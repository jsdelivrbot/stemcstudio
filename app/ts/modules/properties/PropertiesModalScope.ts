import IOption from '../../services/options/IOption';

interface PropertiesModalScope {

    /**
     * form
     */
    f: {
        /**
         * project name
         */
        n: string;
        /**
         * project version
         */
        v: string;
        /**
         * operatorOverloading
         */
        o: boolean;
        /**
         * dependency (packageName only)
         */
        dependencies: string[];
    };
    toggleDependency(packageName: string): void;
    options: IOption[];
    ok(): void;
    submit(): void;
    cancel(): void;
}

export default PropertiesModalScope;
