import doodleConfig from './doodleConfig';
import IDoodle from '../services/doodles/IDoodle';
import IDoodleFile from '../services/doodles/IDoodleFile';
import GistData from '../services/gist/GistData';
import stripWS from './stripWS';
import IOptionManager from '../services/options/IOptionManager';
import modeFromName from './modeFromName';

function mash(name: string, content: string): string {
    const mode = modeFromName(name)
    switch (mode) {
        case 'HTML': {
            if (stripWS(content).length > 0) {
                return content;
            }
            else {
                return '<!DOCTYPE html>\n';
            }
        }
        case 'JavaScript':
        case 'TypeScript': {
            if (stripWS(content).length > 0) {
                return content;
            }
            else {
                return '//\n';
            }
        }
        case 'CSS':
        case 'LESS': {
            if (stripWS(content).length > 0) {
                return content;
            }
            else {
                return '//\n';
            }
        }
        case 'Markdown': {
            if (stripWS(content).length > 0) {
                return content;
            }
            else {
                return '#\n';
            }
        }
        default: {
            console.warn(`${name} => ${mode}, ${stripWS(content).length}`)
        }
    }
    return content
}

function doodleFilesToGistFiles(dFiles: { [name: string]: IDoodleFile }, trash: { [name: string]: IDoodleFile }): { [name: string]: { content: string } } {
    const gFiles: { [name: string]: { content: string } } = {}

    const dFileNames = Object.keys(dFiles)
    const iLen = dFileNames.length
    for (let i = 0; i < iLen; i++) {
        const name = dFileNames[i]
        const dFile: IDoodleFile = dFiles[name]
        const gFile: { content: string } = { content: mash(name, dFile.content) }
        gFiles[name] = gFile
    }

    const trashNames = Object.keys(trash)
    const jLen = trashNames.length
    for (let j = 0; j < jLen; j++) {
        const name = trashNames[j]
        // Deletes are performed by including a filename with a null object.
        gFiles[name] = null
    }
    return gFiles
}

export default function(doodle: IDoodle, options: IOptionManager): GistData {
    const gist: GistData = {
        description: doodle.description,
        public: true,
        files: doodleFilesToGistFiles(doodle.files, doodle.trash)
    }
    gist.files['doodle.json'] = { content: JSON.stringify(doodleConfig(doodle, options), null, 2) + "\n" }
    return gist
}
