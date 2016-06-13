import Doodle from '../services/doodles/Doodle';

export default function copyDoodleToDoodle(doodleIn: Doodle, doodleOut: Doodle): void {

    // Copy the files first so that the setting properties side-effect of creating files
    // does not cause duplicated files.
    const paths = Object.keys(doodleIn.files);
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const doodleFileIn = doodleIn.files[path];
        const doodleFile = doodleOut.newFile(path);
        doodleFile.content = doodleFileIn.content;
        doodleFile.language = doodleFileIn.language;
    }

    doodleOut.description = doodleIn.description;
    doodleOut.dependencies = doodleIn.dependencies;
    doodleOut.operatorOverloading = doodleIn.operatorOverloading;
}
