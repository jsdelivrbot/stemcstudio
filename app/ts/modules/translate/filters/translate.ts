import { IParseService } from 'angular';
import { ITranslateService, TRANSLATE_SERVICE_UUID } from '../api';

/**
 * A filter allowing text to be translated synchronously.
 * This is deprecated because translation must operate asynchronously.
 */
export function translateFilterFactory($parse: IParseService, $translate: ITranslateService) {


    const translateFilter = function (this: any, input: string) {
        return input;
    };

    return translateFilter;
}

translateFilterFactory['$inject'] = ['$parse', TRANSLATE_SERVICE_UUID];
