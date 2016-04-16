import DoodleFile from '../doodles/DoodleFile'
import modeFromName from '../../utils/modeFromName';

/**
 * @function makeDoodleFile
 * @param name {string}
 * @param content {string}
 * @return {DoodleFile}
 */
export default function(name: string, content: string): DoodleFile {
    const file = new DoodleFile()
    file.content = content
    file.language = modeFromName(name)
    return file
}
