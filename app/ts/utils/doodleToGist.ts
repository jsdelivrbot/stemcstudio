import doodleConfig from './doodleConfig';
import IDoodle from '../services/doodles/IDoodle';
import IDoodleFile from '../services/doodles/IDoodleFile';
import GistData from '../services/gist/GistData';
import stripWS from './stripWS';
import IOptionManager from '../services/options/IOptionManager';

function mash(name: string, content: string): string {
    switch (name) {
        case 'index.html': {
            if (stripWS(content).length > 0) {
                return content;
            }
            else {
                return '<!DOCTYPE html>\n';
            }
        }
        case 'script.ts': {
            if (stripWS(content).length > 0) {
                return content;
            }
            else {
                return '//\n';
            }
        }
        case 'style.less': {
            if (stripWS(content).length > 0) {
                return content;
            }
            else {
                return '//\n';
            }
        }
    }
    return content
}

function doodleFilesToGistFiles(dFiles: { [name: string]: IDoodleFile }): { [name: string]: { content: string } } {
    const gFiles: { [name: string]: { content: string } } = {}
    const names = Object.keys(dFiles)
    const iLen = names.length
    for (let i = 0; i < iLen; i++) {
        const name = names[i]
        const dFile: IDoodleFile = dFiles[name]
        const gFile: { content: string } = { content: mash(name, dFile.content) }
        gFiles[name] = gFile
    }
    return gFiles
}

export default function(doodle: IDoodle, options: IOptionManager): GistData {
    const gist: GistData = {
        description: doodle.description,
        public: true,
        files: doodleFilesToGistFiles(doodle.files)
    }
    gist.files['doodle.json'] = { content: JSON.stringify(doodleConfig(doodle, options), null, 2) }
    return gist
}
