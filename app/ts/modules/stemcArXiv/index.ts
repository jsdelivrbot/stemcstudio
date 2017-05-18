import { module } from 'angular';
import SearchService from './services/SearchService';

export const stemcArXivModule = module('stemcArXiv', []);

stemcArXivModule.service('stemcArXiv', SearchService);

stemcArXivModule.config([function () {
    // console.lg(`${search.name}.config(...)`);
}]);

stemcArXivModule.run([function () {
    // console.lg(`${search.name}.run(...)`);
}]);
