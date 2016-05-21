import IOption from '../../services/options/IOption';
import PropertiesSettings from './PropertiesSettings';

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
    toggleDependency(name: string);
    options: IOption[];
    ok(): void;
    submit(): void;
    cancel(); void;
}

export default PropertiesModalScope;
