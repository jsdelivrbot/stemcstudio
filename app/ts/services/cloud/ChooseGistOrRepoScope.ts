import { ChooseGistOrRepoOptions } from './ChooseGistOrRepoOptions';

export interface ChooseGistOrRepoScope {
    options: ChooseGistOrRepoOptions;
    gist(): void;
    repo(): void;
    cancel(): void;
}
