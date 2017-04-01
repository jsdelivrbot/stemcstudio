import { module } from 'angular';
import SearchService from './services/SearchService';

const search = module('stemcArXiv', []);

search.service('stemcArXiv', SearchService);

search.config([function () {
    // console.lg(`${search.name}.config(...)`);
}]);

search.run([function () {
    // console.lg(`${search.name}.run(...)`);
}]);

export default search;
