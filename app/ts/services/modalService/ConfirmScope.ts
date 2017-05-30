import { ConfirmOptions } from './ConfirmOptions';

export interface ConfirmScope {
    options: ConfirmOptions;
    ok(): void;
    cancel(): void;
}
