import * as angular from 'angular';

interface HitResponse {
    hits: number;
}

/**
 * Spike used to test GET/POST against the server.
 */
export default class HitService {
    public static $inject: string[] = ['$q', '$http'];
    constructor(private $q: angular.IQService, private $http: angular.IHttpService) {
        // Do nothing.
    }
    count(): ng.IPromise<number> {
        const d = this.$q.defer<number>();
        this.$http.get<HitResponse>('/hits')
            .then(function(promiseValue) {
                const data = promiseValue.data
                d.resolve(data.hits)
            })
            .catch(function(reason) {
                d.reject(reason)
            })
        return d.promise;
    }
    registerHit(): ng.IPromise<number> {
        const d = this.$q.defer<number>();
        this.$http.post<HitResponse>('/hit', {})
            .then(function(promiseValue) {
                const data = promiseValue.data
                d.resolve(data.hits)
            })
            .catch(function(reason) {
                d.reject(reason)
            })
        return d.promise;
    }
}
