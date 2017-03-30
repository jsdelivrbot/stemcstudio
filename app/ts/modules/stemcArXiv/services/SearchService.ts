import ISearchParams from '../SearchParams';
import ISearchResponse from '../SearchResponse';
import IStemcArXiv from '../StemcArXiv';
import ISubmitParams from '../SubmitParams';
import ISubmitResponse from '../SubmitResponse';

export default class SearchService implements IStemcArXiv {

    public static $inject: string[] = ['$q', '$http'];

    constructor(private $q: ng.IQService, private $http: ng.IHttpService) {
        // Do nothing.
    }

    search(params: ISearchParams): ng.IPromise<ISearchResponse> {
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

    submit(params: ISubmitParams): ng.IPromise<ISubmitResponse> {
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
