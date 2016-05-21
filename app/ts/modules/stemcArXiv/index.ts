import * as angular from 'angular';

import SearchService from './services/SearchService';

const search: angular.IModule = angular.module('stemcArXiv', []);

search.service('stemcArXiv', SearchService);

search.config([function() {
    // console.log(`${search.name}.config(...)`);
}]);

search.run([function() {
    // console.log(`${search.name}.run(...)`);
}]);

export default search;
