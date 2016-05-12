import Doodle from '../../services/doodles/Doodle';
import DoodleFile from '../../services/doodles/DoodleFile';

/**
 * Existence check of a file (by name).
 */
function exists(fileName: string, doodle: Doodle): boolean {
    if (typeof fileName !== 'string') {
        throw new Error("fileName must be a string");
    }
    if (!(doodle instanceof Doodle)) {
        throw new Error("doodle must be a Doodle");
    }
    if (typeof doodle.files !== 'object') {
        throw new Error("doodle.files must be an object");
    }
    const file: DoodleFile = doodle.files[fileName];
    return typeof file === 'object';
}

/**
 * Detects that the program is a 1.x version.
 * 
 * A 1.x program has exactly four working files with fixed names.
 */
export default function detect1x(doodle: Doodle): boolean {
    // It's OK to have these file name constants because we are detecting fixed 1.x characteristics.
    if (exists('index.html', doodle) && exists('script.ts', doodle) && exists('extras.ts', doodle) && exists('style.less', doodle)) {
        // It MAY be a 1.x Doodle, but 2.x migrated projects may use the same file names as 1.x.
        // Look for the LIBS-MARKER (which exists in 1.x and is removed for 2.x and above).
        const indexFile: DoodleFile = doodle.files['index.html'];
        return indexFile.content.indexOf("// LIBS-MARKER") >= 0;
    }
    else {
        // It's definitely not a 1.x Doodle.
        return false;
    }
}
