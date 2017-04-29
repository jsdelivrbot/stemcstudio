import { AppScope } from './AppScope';
import Gist from '../services/github/Gist';

/**
 * 
 */
export interface BodyScope extends AppScope {
    /**
     * A page of Gist.
     */
    gists: Gist[];
    /**
     * Hypermedia Links for pagination.
     */
    links: { [rel: string]: string };
    /**
     * 
     */
    clickDownload(): void;
}
