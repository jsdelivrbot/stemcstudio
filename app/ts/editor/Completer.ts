import { Completion } from './Completion';
import { Position } from 'editor-document';

export interface CompleterEditor {

}

/**
 *
 */
export interface Completer {

    /**
     *
     */
    identifierRegexps?: RegExp[];

    /**
     *
     */
    getCompletionsAtPosition(editor: CompleterEditor, position: Position, prefix: string): Promise<Completion[]>;

    /**
     *
     */
    // getCompletions(editor: CompleterEditor, position: Position, prefix: string, callback: (err: any, results: Completion[]) => any): void;

    /**
     * The completer may, optionally, define how it wants insertions to be performed.
     * TODO: But how does it know what the insertion is?
     */
    insertMatch?(editor: CompleterEditor): void;

    /**
     *
     */
    getDocTooltip?(completion: Completion): any;
}
