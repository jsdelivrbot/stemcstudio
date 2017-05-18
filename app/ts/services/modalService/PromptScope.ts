import { PromptOptions } from './PromptOptions';

interface PromptScope {
    options: PromptOptions;
    ok(): void;
    cancel(): void;
}

export default PromptScope;
