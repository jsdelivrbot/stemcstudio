//
// davinci-csv.d.ts
//
// This file was created manually in order to support the davinci-csv library.
// These declarations are appropriate when using the library through the global
// variable, 'CSV'.
//
/**
 * Comma Separated Value (CSV) Library for JavaScript with TypeScript d.ts files..
 */
declare module CSV {

    /**
     * 
     */
    interface Data {
        fields: { id: string }[];
        records: { [fieldId: string]: (number | string | null) }[];
    }

    /**
     * 
     */
    export interface Dialect {
        delimiter?: string;
        doubleQuote?: boolean;
        lineTerminator?: string;
        quoteChar?: string;
        skipInitialRows?: number;
        skipInitialSpace?: boolean;
        trim?: boolean;
    }

    /**
     * Converts from the fields and records structure to an array of arrays.
     * The first row in the output contains the field names in the same order as the input.
     */
    function dataToArrays(data: Data): (number | string | null)[][];

    /**
     * 
     */
    function parse(s: string, dialect?: Dialect): (number | string | null)[][];

    /**
     * Converts from structured data to a string in CSV format of the specified dialect.
     */
    function serialize(data: Data | (number | string | null)[][], dialect?: Dialect): string;
}

declare module 'csv' {
    export = CSV;
}
