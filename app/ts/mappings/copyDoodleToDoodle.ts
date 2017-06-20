import { Doodle } from '../services/doodles/Doodle';

export default function copyDoodleToDoodle(doodleIn: Doodle, doodleOut: Doodle): void {

    // Copy the files first so that the setting properties side-effect of creating files
    // does not cause duplicated files.
    const paths = Object.keys(doodleIn.files);
    for (const path of paths) {
        const doodleFileIn = doodleIn.files[path];
        const doodleFile = doodleOut.newFile(path);
        doodleFile.content = doodleFileIn.content;
        doodleFile.isOpen = doodleFileIn.isOpen;
        doodleFile.language = doodleFileIn.language;
        doodleFile.htmlChoice = doodleFileIn.htmlChoice;
        doodleFile.markdownChoice = doodleFileIn.markdownChoice;
        // The raw_url is sentinel that the file is in GitHub.
        // If we don't clear it then Gist create will fail if we delete this file.
        doodleFile.raw_url = void 0;
        doodleFile.selected = doodleFileIn.selected;
    }

    doodleOut.description = doodleIn.description;
    doodleOut.dependencies = doodleIn.dependencies;
    doodleOut.hideConfigFiles = doodleIn.hideConfigFiles;
    doodleOut.linting = doodleIn.linting;
    doodleOut.noLoopCheck = doodleIn.noLoopCheck;
    doodleOut.operatorOverloading = doodleIn.operatorOverloading;
}
