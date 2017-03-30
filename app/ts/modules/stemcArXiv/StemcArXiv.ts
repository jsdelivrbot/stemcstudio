import SearchParams from './SearchParams';
import SearchResponse from './SearchResponse';
import SubmitParams from './SubmitParams';
import SubmitResponse from './SubmitResponse';

/**
 * SDK for the STEMC Archive.
 */
interface StemcArXiv {
    search(params: SearchParams): ng.IPromise<SearchResponse>;
    submit(params: SubmitParams): ng.IPromise<SubmitResponse>;
}

export default StemcArXiv;
