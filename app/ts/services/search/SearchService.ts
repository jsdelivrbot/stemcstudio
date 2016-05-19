import * as angular from 'angular';

interface SearchResponse {
    found: number;
    start: number;
    refs: {
        href: string;
        owner: string;
        gistId: string;
        title: string;
        author: string;
        keywords: string[];
    }[];
}

/**
 * Spike used to proxy a search to AWS.CloudSearchDomain.
 */
export default class SearchService {
    public static $inject: string[] = ['$q', '$http'];
    constructor(private $q: angular.IQService, private $http: angular.IHttpService) {
        // Do nothing.
    }

    /**
     * 
     */
    search(params: { query: string }): ng.IPromise<SearchResponse> {
        const d = this.$q.defer<SearchResponse>();
        this.$http.post<SearchResponse>('/search', params)
            .then(function(promiseValue) {
                const data = promiseValue.data;
                d.resolve(data);
            })
            .catch(function(reason: { data: string; status: number; statusText: string }) {
                d.reject(reason);
            });
        return d.promise;
    }
}
