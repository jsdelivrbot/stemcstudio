import LabelSettings from './LabelSettings';
import Level from './Level';

interface LabelModalScope {

    levels: Level[];

    /**
     * form
     */
    f: {
        /**
         * title
         */
        t: string;
        /**
         * abstract
         */
        a: string;
        /**
         * keywords
         */
        k: string;
    };

    ok(): void;
    submit(): void;
    cancel(); void;
}

export default LabelModalScope;
