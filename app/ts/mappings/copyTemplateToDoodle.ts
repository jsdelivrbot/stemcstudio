import ITemplate from '../services/templates/ITemplate';
import Doodle from '../services/doodles/Doodle';

export default function copyTemplateToDoodle(template: ITemplate, doodle: Doodle): void {

    // Copy the files first so that the setting properties side-effect of creating files
    // does not cause duplicated files.
    const paths = Object.keys(template.files);
    for (const path of paths) {
        const templateFile = template.files[path];
        const doodleFile = doodle.newFile(path);
        doodleFile.content = templateFile.content;
        doodleFile.isOpen = false;
        doodleFile.language = templateFile.language;
        doodleFile.htmlChoice = false;
        doodleFile.markdownChoice = false;
        doodleFile.raw_url = void 0;
        doodleFile.selected = false;
    }

    doodle.description = template.description;
    doodle.dependencies = template.dependencies;
    doodle.linting = template.linting;
    doodle.noLoopCheck = template.noLoopCheck;
    doodle.operatorOverloading = template.operatorOverloading;
}
