import Doodle from '../../services/doodles/Doodle';

/**
 * Determines whether the doodle contains the specified file by name.
 * 
 * @function fileExists
 * @param fileName {string}
 * @param doodle {Doodle}
 * @return {boolean}
 */
export default function fileExists(fileName: string, doodle: Doodle): boolean {
    const file = doodle.files[fileName];
    if (file) {
        return true
    }
    else {
        return false
    }
}
