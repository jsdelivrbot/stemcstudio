import PromptOptions from './PromptOptions';

interface PromptScope {
    options: PromptOptions;
    ok();
    cancel();
}

export default PromptScope;
