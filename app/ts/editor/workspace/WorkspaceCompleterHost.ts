import { CompletionEntry } from './CompletionEntry';

export interface WorkspaceCompleterHost {
    /**
     * TODO: Parameterize position?
     */
    getCompletionsAtPosition(path: string, position: number, prefix: string): Promise<CompletionEntry[]>;
}
