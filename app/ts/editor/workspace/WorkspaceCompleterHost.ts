import CompletionEntry from './CompletionEntry';

interface WorkspaceCompleterHost {
    getCompletionsAtPosition(path: string, position: number, prefix: string): Promise<CompletionEntry[]>;
}

export default WorkspaceCompleterHost;
