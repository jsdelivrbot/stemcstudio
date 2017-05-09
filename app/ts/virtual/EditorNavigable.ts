export interface EditorNavigable {

    gotoLine(lineNumber: number, column?: number): void;

    gotoPageDown(): void;
    gotoPageUp(): void;

    jumpToMatching(select?: boolean): void;

    navigateDown(times: number): void;
    navigateLeft(times: number): void;
    navigateRight(times: number): void;
    navigateUp(times: number): void;

    navigateFileStart(): void;
    navigateFileEnd(): void;

    navigateLineStart(): void;
    navigateLineEnd(): void;

    navigateWordLeft(): void;
    navigateWordRight(): void;
}
