import SearchParams from './SearchParams';
import SearchResponse from './SearchResponse';

/**
 * SDK for the STEMC Archive.
 */
interface StemcArXiv {
    search(params: SearchParams): ng.IPromise<SearchResponse>;
}

export default StemcArXiv;
