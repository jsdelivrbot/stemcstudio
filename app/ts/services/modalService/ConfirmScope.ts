import { ConfirmOptions } from './ConfirmOptions';

interface ConfirmScope {
    options: ConfirmOptions;
    ok(): void;
    cancel(): void;
}

export default ConfirmScope;
