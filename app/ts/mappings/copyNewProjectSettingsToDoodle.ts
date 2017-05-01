import { copyTemplateToDoodle } from './copyTemplateToDoodle';
import Doodle from '../services/doodles/Doodle';
import { hyphenate } from '../utils/hyphenate';
import { NewProjectSettings } from '../modules/project/NewProjectSettings';

export function copyNewProjectSettingsToDoodle(settings: NewProjectSettings, doodle: Doodle): void {
    //
    //
    //
    copyTemplateToDoodle(settings.template, doodle);
    doodle.name = hyphenate(settings.description);
    doodle.description = settings.description;
    doodle.version = settings.version;
}
