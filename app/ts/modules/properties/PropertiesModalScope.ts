import { IOption } from '../../services/options/IOption';

export interface PropertiesModalScope {

    /**
     * form
     */
    f: {
        /**
         * project name (package name).
         */
        n: string;
        /**
         * project version.
         */
        v: string;
        /**
         * hide configuration files such as package.json, tsconfig.json, tslint.json.
         */
        hideConfigFiles: boolean;
        /**
         * enable linting.
         */
        linting: boolean;
        /**
         * disable infinite loop detection.
         */
        loopCheck: boolean;
        /**
         * operatorOverloading.
         */
        o: boolean;
        /**
         * dependency (packageName only).
         */
        dependencies: string[];
    };
    toggleDependency(packageName: string): void;
    options: IOption[];
    ok(): void;
    submit(): void;
    cancel(): void;
}
