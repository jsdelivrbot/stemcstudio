import { IPromise } from 'angular';
import SearchParams from './SearchParams';
import SearchResponse from './SearchResponse';
import SubmitParams from './SubmitParams';
import SubmitResponse from './SubmitResponse';

/**
 * SDK for the STEMC Archive.
 */
interface StemcArXiv {
    search(params: SearchParams): IPromise<SearchResponse>;
    submit(params: SubmitParams): IPromise<SubmitResponse>;
}

export default StemcArXiv;
