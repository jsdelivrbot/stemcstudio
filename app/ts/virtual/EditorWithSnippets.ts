import { Snippet } from './editor';

export interface EditorWithSnippets {
    expandSnippetWithTab(options: { dryRun: boolean }): boolean;
    isSnippetSelectionMode(): boolean;
    registerSnippets(snippets: Snippet[]): void;
}
