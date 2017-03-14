import Completer from './autocomplete/Completer';
import Completion from './Completion';
import Editor from './Editor';
import Position from './Position';

export default class SnippetCompleter implements Completer {

    getCompletionsAtPosition(editor: Editor, position: Position, prefix: string): Promise<Completion[]> {

        return new Promise<Completion[]>(function (resolve, reject) {

            const snippetMap = editor.snippetManager.snippetMap;
            const completions: Completion[] = [];
            editor.snippetManager.getActiveScopes(editor).forEach(function (scope) {
                const snippets = snippetMap[scope] || [];
                for (const s of snippets) {
                    const caption = s.name || s.tabTrigger;
                    if (!caption)
                        continue;
                    completions.push({
                        caption: caption,
                        snippet: s.content,
                        // Unicode Character 'RIGHTWARDS ARROW TO BAR' (U+21E5)
                        meta: s.tabTrigger && !s.name ? s.tabTrigger + "\u21E5 " : "snippet"
                    });
                }
            });
            resolve(completions);
        });
    }

    getCompletions(editor: Editor, position: Position, prefix: string, callback: (err: any, completions?: Completion[]) => void) {
        this.getCompletionsAtPosition(editor, position, prefix)
            .then(function (completions) {
                callback(void 0, completions);
            })
            .catch(function (err) {
                callback(err);
            });
    }
}
