import { PromptOptions } from './PromptOptions';

export interface PromptScope {
    options: PromptOptions;
    ok(): void;
    cancel(): void;
}
