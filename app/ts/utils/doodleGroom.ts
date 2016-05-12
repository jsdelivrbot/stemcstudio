import Doodle from '../services/doodles/Doodle';
import DoodleFile from '../services/doodles/DoodleFile';
import modeFromName from './modeFromName';

function isString(s: string): boolean {
    return typeof s === 'string';
}

function migrate1xTo2x(doodle: Doodle): Doodle {

    // Version 1.x used a fixed set of four files with properties that were strings.
    const FILENAME_HTML = 'index.html';
    const PROPERTY_HTML = 'html';

    const FILENAME_CODE = 'script.ts';
    const PROPERTY_CODE = 'code';

    const FILENAME_LIBS = 'extras.ts';
    const PROPERTY_LIBS = 'libs';

    const FILENAME_LESS = 'style.less';
    const PROPERTY_LESS = 'less';

    // If all of the properties exists and are of the correct type, migrate to files property and remove old properties.
    if (isString(doodle[PROPERTY_HTML]) && isString(doodle[PROPERTY_CODE]) && isString(doodle[PROPERTY_LIBS]) && isString(doodle[PROPERTY_LESS])) {

        doodle.files = {};

        doodle.files[FILENAME_HTML] = new DoodleFile();
        doodle.files[FILENAME_HTML].content = doodle[PROPERTY_HTML];
        doodle.files[FILENAME_HTML].language = modeFromName(FILENAME_HTML);
        delete doodle[PROPERTY_HTML];

        doodle.files[FILENAME_CODE] = new DoodleFile();
        doodle.files[FILENAME_CODE].content = doodle[PROPERTY_CODE];
        doodle.files[FILENAME_CODE].language = modeFromName(FILENAME_CODE);
        delete doodle[PROPERTY_CODE];

        doodle.files[FILENAME_LIBS] = new DoodleFile();
        doodle.files[FILENAME_LIBS].content = doodle[PROPERTY_LIBS];
        doodle.files[FILENAME_LIBS].language = modeFromName(FILENAME_LIBS);
        delete doodle[PROPERTY_LIBS];

        doodle.files[FILENAME_LESS] = new DoodleFile();
        doodle.files[FILENAME_LESS].content = doodle[PROPERTY_LESS];
        doodle.files[FILENAME_LESS].language = modeFromName(FILENAME_LESS);
        delete doodle[PROPERTY_LESS];
    }

    return doodle;
}

/**
 * This function primarily supports migration of the local storage JSON.
 * The gists that are stored on GitHub are automatically converted upon deserialization.
 */
export default function(doodle: Doodle): Doodle {
    return migrate1xTo2x(doodle);
}
