// Type definitions for davinci-csv 0.9.2
// Project: https://github.com/geometryzen/davinci-csv
// Definitions by: David Geo Holmes david.geo.holmes@gmail.com https://www.stemcstudio.com

// This file was created manually in order to support the davinci-csv library.
// These declarations are appropriate when using the library through the global
// variable, 'CSV'.
//

export = CSV;
export as namespace CSV;

/**
 * Comma Separated Value (CSV) Library for JavaScript with TypeScript d.ts files.
 */
declare namespace CSV {
    /**
     * A field in a comma-separated file is either a number, a string, or null.
     */
    type Field = number | string | null;

    /**
     * A format for relational data.
     */
    interface Data {
        fields: { id: string }[];
        records: { [fieldId: string]: Field }[];
    }

    /**
     * Specifies the properties of the Comma Separated Value format.
     */
    interface Dialect {
        /**
         * Specifies the delimiter between fields.
         * Default is the comma, `,`.
         * Used for parsing and serialization.
         */
        fieldDelimiter?: string;
        /**
         * Determines whether embedded quotation marks in strings are escaped by doubling them.
         * Default is `true`.
         * Used for serialization only.
         */
        escapeEmbeddedQuotes?: boolean;
        /**
         * Specifies the character used to terminate a line.
         * Default is a single newline character, `\n`.
         * Used for parsing and serialization.
         */
        lineTerminator?: string;
        /**
         * The character used for quoting string fields.
         * Default is the double quote, `"`.
         * Used for parsing and serialization.
         */
        quoteChar?: string;
        /**
         * Skips the specified number of initial rows.
         * Usually used for removing headings.
         * Used for parsing only.
         * Default is zero, `0`.
         */
        skipInitialRows?: number;
        /**
         * Determines whether a field is trimmed during parsing.
         * Used for parsing only.
         * Default is `true`.
         */
        trimFields?: boolean;
    }

    class CSVError {
        public code: string;
        public message: string;
        public index: number;
        public line: number;
        public column: number;
        constructor(code: string, message: string, index: number, line: number, column: number);
    }

    /**
     * Converts from the fields and records structure to an array of arrays.
     * The first row in the output contains the field names in the same order as the input `data`.
     */
    function dataToArrays(data: Data): Field[][];

    /**
     * Parses a string representation of CSV data into an array of arrays, [][]
     * The dialect may be specified to improve the parsing.
     */
    function parse(csvText: string, dialect?: Dialect, errors?: CSVError[]): Field[][];

    /**
     * Converts from structured data to a string in CSV format of the specified dialect.
     */
    function serialize(data: Data | Field[][], dialect?: Dialect): string;
}

declare module 'csv' {
    export = CSV;
}
