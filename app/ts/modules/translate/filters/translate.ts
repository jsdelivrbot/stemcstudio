import { ITranslateService, TRANSLATE_SERVICE_UUID } from '../api';

/**
 * A filter allowing text to be translated synchronously.
 * This is deprecated because translation must operate asynchronously.
 */
function translateFilterFactory($parse: ng.IParseService, $translate: ITranslateService) {


    const translateFilter = function (this: any, input: string) {
        return input;
    };

    return translateFilter;
}

translateFilterFactory['$inject'] = ['$parse', TRANSLATE_SERVICE_UUID];

export default translateFilterFactory;
