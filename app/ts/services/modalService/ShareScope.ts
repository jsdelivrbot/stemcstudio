import { ShareOptions } from './ShareOptions';

export interface ShareScope {
    options: ShareOptions;
    close(): void;
}
