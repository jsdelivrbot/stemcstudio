export declare class CSVError {
    code: string;
    message: string;
    index: number;
    line: number;
    column: number;
    constructor(code: string, message: string, index: number, line: number, column: number);
}
