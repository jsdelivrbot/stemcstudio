import { IHttpService, IPromise, IQService } from 'angular';
import { SearchParams as ISearchParams } from '../SearchParams';
import { SearchResponse as ISearchResponse } from '../SearchResponse';
import { StemcArXiv as IStemcArXiv } from '../StemcArXiv';
import { SubmitParams as ISubmitParams } from '../SubmitParams';
import { SubmitResponse as ISubmitResponse } from '../SubmitResponse';

/**
 * TODO: Migrate from AngularJS to Angular.
 */
export class SearchService implements IStemcArXiv {

    public static $inject: string[] = ['$q', '$http'];

    constructor(private $q: IQService, private $http: IHttpService) {
        // Do nothing.
    }

    search(params: ISearchParams): IPromise<ISearchResponse> {
        const d = this.$q.defer<ISearchResponse>();
        this.$http.post<ISearchResponse>('/search', params)
            .then(function (promiseValue) {
                const data = promiseValue.data;
                d.resolve(data);
            })
            .catch(function (reason: { data: string; status: number; statusText: string }) {
                d.reject(reason);
            });
        return d.promise;
    }

    submit(params: ISubmitParams): IPromise<ISubmitResponse> {
        const d = this.$q.defer<ISubmitResponse>();
        this.$http.post<ISubmitResponse>('/submissions', params)
            .then(function (promiseValue) {
                const data = promiseValue.data;
                d.resolve(data);
            })
            .catch(function (reason: { data: string; status: number; statusText: string }) {
                d.reject(reason);
            });
        return d.promise;
    }
}
