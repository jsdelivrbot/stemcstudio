import { Completer } from '../Completer';
import { Completion } from '../Completion';
import { EditSession } from '../EditSession';
import { Editor } from '../Editor';
import { Position } from "editor-document";
import { Range } from "../Range";

/**
 * A map from the word (string) to score (number).
 */
interface WordScores {
    [word: string]: number;
}

/**
 * Does a distance analysis of the word at the specified position.
 */
function wordDistance(position: Position, session: EditSession): WordScores {
    const splitRegex: RegExp = /[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;

    function getWordIndex(): number {
        const textBefore = session.getTextRange(Range.fromPoints({ row: 0, column: 0 }, position));
        return textBefore.split(splitRegex).length - 1;
    }

    const prefixPos: number = getWordIndex();
    const words: string[] = session.getValue().split(splitRegex);
    const wordScores: WordScores = Object.create(null);

    const currentWord: string = words[prefixPos];

    words.forEach(function (word: string, index: number) {
        if (!word || word === currentWord) return;

        const distance = Math.abs(prefixPos - index);
        const score = words.length - distance;
        if (wordScores[word]) {
            wordScores[word] = Math.max(score, wordScores[word]);
        }
        else {
            wordScores[word] = score;
        }
    });
    return wordScores;
}

/**
 * Provides completions based upon nearby words.
 */
export class TextCompleter implements Completer {

    getCompletionsAtPosition(editor: Editor, position: Position, prefix: string): Promise<Completion[]> {

        const session = editor.getSession();

        return new Promise<Completion[]>(function (resolve, reject) {

            const wordScore: WordScores = wordDistance(position, session);

            const wordList: string[] = Object.keys(wordScore);

            resolve(wordList.map(function (word: string) {
                return {
                    caption: word,
                    value: word,
                    score: wordScore[word],
                    meta: "local"
                };
            }));

        });
    }

    getCompletions(editor: Editor, position: Position, prefix: string, callback: (err: any, completions?: Completion[]) => void): void {
        this.getCompletionsAtPosition(editor, position, prefix)
            .then(function (completions) {
                callback(void 0, completions);
            })
            .catch(function (err) {
                callback(err);
            });
    }
}

