import Doodle from '../../services/doodles/Doodle';

export interface OpenProjectSettings {
    /**
     * The doodle that the user has selected to open.
     */
    doodle?: Doodle;
}

export default OpenProjectSettings;
