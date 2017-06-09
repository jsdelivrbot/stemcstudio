// Type definitions for code-writer 0.1.0
// Project: https://github.com/geometryzen/code-writer
//
// This file was created manually in order to support the code-writer library.


export class MutablePosition {
    /**
     * 1-based line number.
     */
    line: number;
    /**
     * 0-based column index.
     */
    column: number;
    /**
     *
     * @param line
     * @param column
     */
    constructor(line: number, column: number);
    offset(rows: number, cols: number): void;
}

export class MutableRange {
    readonly begin: MutablePosition;
    readonly end: MutablePosition;
    constructor(begin: MutablePosition, end: MutablePosition);
    offset(rows: number, cols: number): void;
}

export class Position {
    /**
     * 1-based line number.
     */
    public readonly line: number;
    /**
     * 0-based column index.
     */
    public readonly column: number;
    /**
     *
     */
    constructor(line: number, column: number);
}

export class Range {
    /**
     * begin is always defined.
     */
    public readonly begin: Position;
    /**
     * end is always defined.
     */
    public readonly end: Position;
    /**
     *
     */
    constructor(begin: Position, end: Position);
}


export class MappingTree {
    /**
     *
     */
    public readonly source: Range;
    /**
     *
     */
    public readonly target: MutableRange;
    /**
     *
     */
    public readonly children: MappingTree[];
    /**
     * @param source
     * @param target
     * @param children
     */
    constructor(source: Range, target: MutableRange, children: MappingTree[]);
    offset(rows: number, cols: number): void;
    mappings(): { source: Range, target: MutableRange }[];
}

export interface TextAndMappings {
    text: string;
    tree: MappingTree;
}

export enum IndentStyle {
    None = 0,
    Block = 1,
    Smart = 2,
}

export interface EditorOptions {
    baseIndentSize?: number;
    indentSize?: number;
    tabSize?: number;
    newLineCharacter?: string;
    convertTabsToSpaces?: boolean;
    indentStyle?: IndentStyle;
}

export interface FormatCodeOptions extends EditorOptions {
    insertSpaceAfterCommaDelimiter?: boolean;
    insertSpaceAfterSemicolonInForStatements?: boolean;
    insertSpaceBeforeAndAfterBinaryOperators?: boolean;
    insertSpaceAfterConstructor?: boolean;
    insertSpaceAfterKeywordsInControlFlowStatements?: boolean;
    insertSpaceAfterFunctionKeywordForAnonymousFunctions?: boolean;
    insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis?: boolean;
    insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets?: boolean;
    insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces?: boolean;
    insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces?: boolean;
    insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces?: boolean;
    insertSpaceAfterTypeAssertion?: boolean;
    insertSpaceBeforeFunctionParenthesis?: boolean;
    placeOpenBraceOnNewLineForFunctions?: boolean;
    placeOpenBraceOnNewLineForControlBlocks?: boolean;
}

export class CodeWriter {
    /**
     * Constructs a CodeWriter instance using the specified options.
     */
    constructor(beginLine: number, beginColumn: number, options?: FormatCodeOptions);
    assign(text: '=', source: Range): void;
    /**
     * Writes a name (identifier).
     * @param id The identifier string to be written.
     * @param begin The position of the beginning of the name in the original source.
     * @param end The position of the end of the name in the original source.
     */
    name(id: string, source: Range): void;
    num(text: string, source: Range): void;
    /**
     * Currently defined to be for string literals in unparsed form.
     */
    str(text: string, source: Range): void;
    write(text: string, tree: MappingTree): void;
    snapshot(): TextAndMappings;
    binOp(binOp: '+' | '-' | '*' | '/' | '|' | '^' | '&' | '<<' | '>>' | '%' | '//', source: Range): void;
    comma(begin: Position | null, end: Position | null): void;
    space(): void;

    beginBlock(): void;
    endBlock(): void;

    beginBracket(): void;
    endBracket(): void;

    beginObject(): void;
    endObject(): void;

    openParen(): void;
    closeParen(): void;

    beginQuote(): void;
    endQuote(): void;

    beginStatement(): void;
    endStatement(): void;
}
